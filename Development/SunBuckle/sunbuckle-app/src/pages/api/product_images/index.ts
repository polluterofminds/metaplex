import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { canAddProductToStore, canMakeChangesToProduct, isAuthenticated } from '@/utils'
import { ProductImages, ProductQuery, Products } from '@/types'
import { getStores, insertStore } from '@/db/stores'
import { getProducts, insertProduct } from '@/db/products'
import { getProductImagesByUserId, insertProductImages } from '@/db/product_images'

export const config = {
  runtime: 'edge',
}

const validateProductImagesPayload = (body: { images: ProductImages[] }) => {
  if (!body.images) {
    return false
  }

  return true;
}

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body: { images: ProductImages[] } = await req.json()
      const authData = await isAuthenticated(req)
      if (!authData.authorized) {
        return new Response("Unauthorized", { status: 401 })
      }

      if (!validateProductImagesPayload(body)) {
        return new Response("Missing required fields", { status: 400 })
      }

      for (const image of body.images) {
        //  Cannot allow a product to be added to a store not controlled by user
        if (!await canMakeChangesToProduct(authData.user_id, image.product_id)) {
          return new Response("Invalid product", { status: 401 })
        }
      }

      await insertProductImages(body.images)
    
      return new Response("Success", { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response("Server error", { status: 500 })
    }
  } else if (req.method === "GET") {
    try {
      const authData = await isAuthenticated(req)
      if (!authData.authorized) {
        return new Response("Unauthorized", { status: 401 })
      }
      const url = req.nextUrl;

      // Access the searchParams directly from req.nextUrl
      const limit = url.searchParams.get('limit');
      const offset = url.searchParams.get('offset');

      const queryObject: ProductQuery = {}

      if (offset) {
        queryObject.offset = parseInt(offset, 10)
      }
      if (limit) {
        queryObject.limit = parseInt(limit, 10)
      }

      const images = await getProductImagesByUserId(authData.user_id, queryObject)
      return Response.json({ data: images })
    } catch (error) {
      console.log(error);
      return new Response("Server error", { status: 500 })
    }
  }
}