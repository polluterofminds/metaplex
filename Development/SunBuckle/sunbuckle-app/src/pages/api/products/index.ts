import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { canAddProductToStore, canMakeChangesToProduct, isAuthenticated } from '@/utils'
import { ProductQuery, Products } from '@/types'
import { getStores, insertStore } from '@/db/stores'
import { getProducts, insertProduct } from '@/db/products'
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
  if(req.method === "POST") {
    try {
      const body: Products = await req.json()
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }
      
      if(!validateProductPayload(body)) {
        return new Response("Missing required fields", {status: 400})
      }

      //  Cannot allow a product to be added to a store not controlled by user
      if(!await canAddProductToStore(authData.user_id, body.store_id)) {
        return new Response("Invalid store", {status: 401})
      }

      body.user_id = authData.user_id;

      //  Store images
      if(body.images) {
        await insertProductImages(body.images)
      }

      delete body.images;

      const store = await insertProduct(body)
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
