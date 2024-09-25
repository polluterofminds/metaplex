import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { canMakeChangesToProduct, isAuthenticated } from '@/utils'
import { ProductQuery, Products, Store } from '@/types'
import { deleteStore, getStoreById, insertStore, updateStore } from '@/db/stores'
import { deleteProduct, getProductById, updateProduct } from '@/db/products'
import { insertProductImages } from '@/db/product_images'

export const config = {
  runtime: 'edge',
}

const validateProductPayload = (body: Products) => {
  if(!body.title) {
    return false
  }

  if(!body.store_id) {
    return false;
  }

  if(!body.price) {
    return false;
  }

  return true;
}

export default async function handler(req: NextRequest) {
  if(req.method === "GET") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      if(!id) {
        return new Response("Product ID is required", {status: 400})
      }
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      
      const url = req.nextUrl;
      const includeImages = url.searchParams.get('includeImages')
      const includeDownloads = url.searchParams.get('includeDownloads')

      const query: ProductQuery = {
        includeImages: includeImages && includeImages === "true" ? true : false,
        includeDownloads: includeDownloads && includeDownloads === "true" ? true : false,
      }
      
      const product = await getProductById(parseInt(id, 10), query)
      return Response.json({ data: product })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  } else if(req.method === "PUT") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      const body: Products = await req.json()
    
      if(!id) {
        return new Response("Product ID Required", {status: 400})
      }

      body.id = parseInt(id, 10);
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      
      if(!validateProductPayload(body)) {
        return new Response("Missing required fields", {status: 400})
      }

      if(body.images) {
        return new Response("Images cannot be added through this endpoint. Please use the /products/:id/product_images endpoint")
      }

      //  Cannot allow a product to be updated to a store not controlled by user
      if(!await canMakeChangesToProduct(authData.user_id, parseInt(id, 10))) {
        return new Response("Invalid store", {status: 401})
      }
  
      body.user_id = authData.user_id;

      //  Store images
      if(body.images && await canMakeChangesToProduct(authData.user_id, body.id)) {
        await insertProductImages(body.images)
      }

      delete body.images;
  
      const product = await updateProduct(body)
      return Response.json({ data: product })
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  } else if(req.method === "DELETE") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop(); 
      if(!id) {
        return new Response("Product ID is required", {status: 400})
      }     
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }

      if(!await canMakeChangesToProduct(authData.user_id, parseInt(id, 10))) {
        return new Response("Unauthorized", {status: 401})
      }
  
      await deleteProduct(parseInt(id, 10), authData.user_id)
      return Response.json({})
    } catch (error) {
      console.log(error);
      return new Response("Server error", {status: 500})
    }
  }
}