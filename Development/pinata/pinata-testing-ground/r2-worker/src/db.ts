import { SupabaseClient, createClient } from '@supabase/supabase-js'

type FileData = {
  id: string;
  user_id: string;
  cid: string;
  custom_id?: string;
  name: string;
}

type QueueData = {
  file_id: string;
  path: string;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
  "Access-Control-Allow-Headers": "*"
}

export const upsertFile = async (fileData: FileData, client: SupabaseClient) => {
  const { data, error } = await client
    .from('files')
    .upsert(fileData)
    .select()

  if (error) {
    console.log(error)
    throw error;
  }

  console.log(data)
  return data
}

export const addToQueue = async (queueData: QueueData, client: SupabaseClient) => {
  const { data, error } = await client
    .from('pending-cids')
    .insert(queueData)
    .select()

  if (error) {
    console.log(error)
    throw error;
  }

  console.log(data)
  return data
}

export const getFiles = async (request: Request, client: SupabaseClient) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const customId = params.get('customId') || "";
  console.log(customId)
  //  Authenticate API key
  if (customId) {
    const { data, error } = await client
    .from('files')
    .select()
    .eq('user_id', "248c56d8-ded8-452c-8d8c-45a22297711c")
    .eq('custom_id', customId)
    if(error) {
      return new Response(JSON.stringify({
        error: "Unable to load files"        
      }), {
        status: 500,
        headers: headers
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers
    });
  } else {
    const { data, error } = await client
    .from('files')
    .select()
    .eq('user_id', "248c56d8-ded8-452c-8d8c-45a22297711c")
    if(error) {
      return new Response(JSON.stringify({
        error: "Unable to load files"        
      }), {
        status: 500,
        headers: headers
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers
    });
  }
}