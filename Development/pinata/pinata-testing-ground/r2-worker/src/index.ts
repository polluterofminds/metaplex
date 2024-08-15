import {
	S3Client,
	CreateMultipartUploadCommand,
	UploadPartCommand,
	CompleteMultipartUploadCommand,
	HeadObjectCommand,
	GetObjectCommand
} from "@aws-sdk/client-s3";
//  @ts-ignore
import Hash from 'ipfs-only-hash'
import { createClient } from '@supabase/supabase-js'
import { addToQueue, getFiles, upsertFile } from "./db";
import { v4 as uuidv4 } from 'uuid';

function bytesToMB(bytes: number) {
	const megabytes = bytes / (1024 * 1024); // Divide by 1,048,576
	return megabytes;
}

function getExtension(mimeType: string) {

}


export default {
	async fetch(request: Request, env: Env, ctx: any) {
		const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

		const S3 = new S3Client({
			region: "auto",
			endpoint: env.R2_ENDPOINT,
			credentials: {
				accessKeyId: env.R2_ACCESS_KEY_ID,
				secretAccessKey: env.R2_SECRET_ACCESS_KEY,
			},
		});

		const headers = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
			"Access-Control-Allow-Headers": "*"
		}

		const url = new URL(request.url);
		const base = url.pathname.split('/').slice(1)[0];

		async function generateCid(env: Env, key: string) {
			try {
				const S3 = new S3Client({
					region: "auto",
					endpoint: env.R2_ENDPOINT,
					credentials: {
						accessKeyId: env.R2_ACCESS_KEY_ID,
						secretAccessKey: env.R2_SECRET_ACCESS_KEY,
					},
				});

				const bucket = env.R2_BUCKET_NAME;

				const command = new GetObjectCommand({
					Bucket: bucket,
					Key: key,
				});

				const response = await S3.send(command);

				// Assuming the response.Body is a ReadableStream in this environment
				const streamToUint8Array = async (stream: any) => {
					const reader = stream.getReader();
					const chunks = [];
					let done, value;

					while ({ done, value } = await reader.read(), !done) {
						chunks.push(value);
					}

					// Concatenate all the chunks into a single Uint8Array
					const length = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
					const result = new Uint8Array(length);

					let offset = 0;
					for (const chunk of chunks) {
						result.set(chunk, offset);
						offset += chunk.length;
					}

					return result;
				};

				const uint8Array = await streamToUint8Array(response.Body);
				console.log("Uint8Array:", uint8Array);
				const hash = await Hash.of(uint8Array, {
					cidVersion: 1
				})
				console.log(hash)
				return hash;
			} catch (error) {
				console.error("Error getting file as buffer:", error);
				throw error;
			}
		}


		async function getObjectMetadata(env: Env, key: string) {
			try {
				const bucket = env.R2_BUCKET_NAME;

				const command = new HeadObjectCommand({
					Bucket: bucket,
					Key: key
				});

				const headData = await S3.send(command);

				console.log('File Size:', headData.ContentLength, 'bytes');
				console.log('Metadata:', headData);

				return headData.ContentLength

			} catch (error) {
				console.error('Error getting object metadata:', error);

				throw error;
			}
		}

		async function getMultiPartUpload(S3: any, request: Request, headers: any, env: Env) {
			try {			
				const url = new URL(request.url);
				const params = url.searchParams;	
				const bucket = env.R2_BUCKET_NAME;
				const key: string = uuidv4();
				const fileName = params.get('filename');

				const command = new CreateMultipartUploadCommand({
					Bucket: bucket,
					Key: `${key}/${fileName}`
				});

				const response = await S3.send(command);
				response["key"] = `${key}/${fileName}`
				return new Response(JSON.stringify({
					msg: 'Success: /getMultiPartUpload',
					response: response
				}), {
					status: 200,
					headers: headers
				});

			} catch (err) {
				return new Response(JSON.stringify({
					msg: 'Error: /getMultiPartUpload',
					error: err
				}), {
					status: 500,
					headers: headers
				});
			}
		};

		async function uploadPart(S3: any, request: Request, headers: any, env: Env) {

			try {
				const url = new URL(request.url);
				const params = url.searchParams;
				const bucket = env.R2_BUCKET_NAME;
				const key = params.get('key');
				const partNumber = params.get('partNumber');
				const uploadId = params.get('uploadId');

				const formData = await request.formData();
				const fileData: any = formData.get('file');

				let contentType = fileData?.type || 'application/octet-stream';
				console.log({contentType})
				const input: any = {
					"Body": fileData,
					"Bucket": bucket,
					"Key": key,
					"PartNumber": partNumber,
					"UploadId": uploadId,
					"ContentType": contentType
				};

				const command = new UploadPartCommand(input);
				const response = await S3.send(command);

				return new Response(JSON.stringify({
					msg: 'Success: /uploadPart',
					response: response
				}), {
					status: 200,
					headers: headers
				});

			} catch (err) {
				return new Response(JSON.stringify({
					msg: 'Error: /uploadPart',
					error: err
				}), {
					status: 500,
					headers: headers
				});
			}
		}

		async function completeMultipartUpload(S3: any, request: Request, headers: any, env: Env) {
			try {
				const url = new URL(request.url);
				const params = url.searchParams;
				const bucket = env.R2_BUCKET_NAME;
				const key = params.get('key') || "";
				const uploadId = params.get('uploadId');
				const customId = params.get('customId')

				const partsData: any = await request.json();
				const parts = partsData.parts;

				const input: any = {
					"Bucket": bucket,
					"Key": key,
					"UploadId": uploadId,
					"MultipartUpload": {
						"Parts": parts
					}
				}

				const command = new CompleteMultipartUploadCommand(input);
				const response = await S3.send(command);
				//	Generate CID depending on the size
				const size: number = await getObjectMetadata(env, key) || 0
				console.log({ size })
				const sizeInMb = bytesToMB(size)

				if (sizeInMb > 100) {
					//	Queue it for CID generation on dedicated server
					//	add to db, don't send webhook post here
					await addToQueue({
						file_id: key.split("/")[0], 
						path: key
					}, supabase)
					response["cid"] = "pending"
					await upsertFile({
						id: key.split("/")[0], 
						user_id: "248c56d8-ded8-452c-8d8c-45a22297711c", 
						cid: "pending", 
						custom_id: customId || "", 
						name: key.split("/")[1] || "No Name Set"
					}, supabase)
					return new Response(JSON.stringify({
						msg: '/completeMultipartUpload',
						response: response
					}), {
						status: 200,
						headers: headers
					});
				} else {
					//	Get the file and hash it
					const cid = await generateCid(env, key)
					response["cid"] = cid;
					await upsertFile({
						id: key.split("/")[0],
						user_id: "248c56d8-ded8-452c-8d8c-45a22297711c", 
						cid: cid, 
						custom_id: customId || "", 
						name: key.split("/")[1] || "No Name Set"
					}, supabase)

					await updateKV(cid, key, env)
					return new Response(JSON.stringify({
						msg: '/completeMultipartUpload',
						response: response
					}), {
						status: 200,
						headers: headers
					});
				}
			} catch (err) {
				return new Response(JSON.stringify({
					msg: 'Error: /completeMultipartUpload',
					error: JSON.stringify(err)
				}), {
					status: 500,
					headers: headers
				});
			}
		}

		async function updateKV(cid: string, path: string, env: Env) {			
			await env.private_files.put(cid, path);
		}

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: headers
			});
		}


		if (request.method === 'GET') {
			if (base === 'getMultiPartUpload') {
				console.log("GETTING..")
				return getMultiPartUpload(S3, request, headers, env);
			} else if (base === "files") {
				return getFiles(request, supabase)
			} else if (base === "download") {
				const url = new URL(request.url);
				const path = url.pathname
				console.log(path)
				const key = path.split("/")[2]
				console.log(key)
				//	Load from path

				let value = await env.private_files.get(key);

				const command = new GetObjectCommand({
					Bucket: env.R2_BUCKET_NAME,
					Key: value,
				});
		
				const response = await S3.send(command);
				const newHeaders: any = {
					'Content-Type': response.ContentType,
					'Content-Disposition': `inline; filename="${key}.${value.split("/")[1] || "txt"}"`,
					'Content-Length': response.ContentLength,
				};

				return new Response(response.Body?.transformToWebStream(), {
					status: 200,
					headers: newHeaders
				});
			}
		}

		if (request.method === 'POST') {
			if (base === 'uploadPart') {
				return uploadPart(S3, request, headers, env);
			}
			if (base === 'completeMultipartUpload') {
				return completeMultipartUpload(S3, request, headers, env);
			}

			if(base === 'updateKv') {
				const body: any = await request.json()
				const { cid, path } = body;
				await updateKV(cid, path, env)
				return new Response(JSON.stringify({
					msg: "Success"
				}), {
					status: 200,
					headers: headers
				});
			}
		}
	}

};
