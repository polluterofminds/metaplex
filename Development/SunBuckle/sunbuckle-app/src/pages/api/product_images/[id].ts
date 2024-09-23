import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { canMakeChangesToProduct, canMakeChangesToProductImage, isAuthenticated } from '@/utils'
import { Products, Store } from '@/types'
import { deleteStore, getStoreById, insertStore, updateStore } from '@/db/stores'
import { deleteProduct, getProductById, updateProduct } from '@/db/products'
import { deleteProductImage, insertProductImages } from '@/db/product_images'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method === "DELETE") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      if (!id) {
        return new Response("Image ID is required", { status: 400 })
      }
      const authData = await isAuthenticated(req)
      if (!authData.authorized) {
        return new Response("Unauthorized", { status: 401 })
      }

      if (!await canMakeChangesToProductImage(authData.user_id, parseInt(id, 10))) {
        return new Response("Unauthorized", { status: 401 })
      }

      await deleteProductImage(parseInt(id, 10))
      return Response.json({})
    } catch (error) {
      console.log(error);
      return new Response("Server error", { status: 500 })
    }
  }
}