import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { canAddProductToStore, canMakeChangesToProduct, isAuthenticated } from '@/utils'
import { Download, ProductQuery, Products } from '@/types'
import { getStores, insertStore } from '@/db/stores'
import { getProducts, insertProduct } from '@/db/products'
import { insertProductImages } from '@/db/product_images'
import { insertDownload } from '@/db/downloads'

export const config = {
  runtime: 'edge',
}

const validateDownloadPayload = (body: Download) => {
  if(!body.file_name) {
    return false
  }

  if(!body.product_id) {
    return false;
  }

  if(!body.download_link) {
    return false;
  }

  if(!body.size_in_bytes) {
    return false;
  }

  return true;
}

export default async function handler(req: NextRequest) {
  if(req.method === "POST") {
    try {
      const body: Download = await req.json()
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      
      if(!validateDownloadPayload(body)) {
        return new Response("Missing required fields", {status: 400})
      }

      //  Cannot allow a product to be added to a store not controlled by user
      if(!await canMakeChangesToProduct(authData.user_id, body.product_id)) {
        return new Response("Invalid product", {status: 401})
      }

      body.user_id = authData.user_id;

      const download = await insertDownload(body)
      return Response.json({ data: download })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  } else if(req.method === "GET") {
    try {
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      const url = req.nextUrl;

      // Access the searchParams directly from req.nextUrl
      const limit = url.searchParams.get('limit');
      const offset = url.searchParams.get('offset');
      const name = url.searchParams.get('name');
      const includeImages = url.searchParams.get('includeImages')
      
      const queryObject: ProductQuery = {} 
      if(name) {
        queryObject.name = name;
      }
      if(offset) {
        queryObject.offset = parseInt(offset, 10)
      }
      if(limit) {
        queryObject.limit = parseInt(limit, 10)
      }

      if(includeImages) {
        queryObject.includeImages = includeImages === "true" ? true : false;
      }

      const stores = await getProducts(authData.user_id, queryObject)
      return Response.json({ data: stores })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  }
}
