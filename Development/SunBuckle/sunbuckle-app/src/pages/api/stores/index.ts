import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { isAuthenticated } from '@/utils'
import { Store, StoreQuery } from '@/types'
import { getStores, insertStore } from '@/db/stores'

export const config = {
  runtime: 'edge',
}

const validateStorePayload = (body: Store) => {
  if(!body.name) {
    return false
  }

  return true;
}

export default async function handler(req: NextRequest) {
  if(req.method === "POST") {
    try {
      const body: Store = await req.json()
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      
      if(!validateStorePayload(body)) {
        return new Response("Missing required fields", {status: 400})
      }

      body.user_id = authData.user_id;

      const store = await insertStore(body)
      return Response.json({ data: store })
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
      
      const queryObject: StoreQuery = {} 
      if(name) {
        queryObject.name = name;
      }
      if(offset) {
        queryObject.offset = parseInt(offset, 10)
      }
      if(limit) {
        queryObject.limit = parseInt(limit, 10)
      }

      const stores = await getStores(authData.user_id, queryObject)
      return Response.json({ data: stores })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  }
}
