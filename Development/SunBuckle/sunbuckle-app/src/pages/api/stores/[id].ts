import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { isAuthenticated } from '@/utils'
import { Store } from '@/types'
import { deleteStore, getStoreById, insertStore, updateStore } from '@/db/stores'

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
  if(req.method === "GET") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      if(!id) {
        return new Response("Store ID is required", {status: 400})
      }
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
  
      const store = await getStoreById(parseInt(id, 10))
      return Response.json({ data: store })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  } else if(req.method === "PUT") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      const body: Store = await req.json()
      body.id = id;
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      
      if(!validateStorePayload(body)) {
        return new Response("Missing required fields", {status: 400})
      }
  
      body.user_id = authData.user_id;
  
      const store = await updateStore(body)
      return Response.json({ data: store })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  } else if(req.method === "DELETE") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop(); 
      if(!id) {
        return new Response("Store ID is required", {status: 400})
      }     
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
  
      await deleteStore(parseInt(id, 10), authData.user_id)
      return Response.json({})
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  }
}