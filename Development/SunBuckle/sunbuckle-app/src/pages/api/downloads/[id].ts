import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { canMakeChangesToDownload, canMakeChangesToProduct, canMakeChangesToProductImage, isAuthenticated } from '@/utils'
import { Products, Store } from '@/types'
import { deleteStore, getStoreById, insertStore, updateStore } from '@/db/stores'
import { deleteProduct, getProductById, updateProduct } from '@/db/products'
import { deleteProductImage, insertProductImages } from '@/db/product_images'
import { deleteDownload, getDownloadById } from '@/db/downloads'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const authData = await isAuthenticated(req)
      if(!authData.authorized) {
        return new Response("Unauthorized", {status: 401})
      }

      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      if (!id) {
        return new Response("Download ID is required", { status: 400 })
      }

      const download = await getDownloadById(parseInt(id, 10), authData.user_id)
      return Response.json({ data: download }, { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response("Server error", { status: 500 })
    }
  } else if (req.method === "DELETE") {
    try {
      const pathname = req.nextUrl.pathname;
      const id = pathname.split('/').pop();
      if (!id) {
        return new Response("Download ID is required", { status: 400 })
      }
      const authData = await isAuthenticated(req)
      if (!authData.authorized) {
        return new Response("Unauthorized", { status: 401 })
      }

      if (!await canMakeChangesToDownload(authData.user_id, parseInt(id, 10))) {
        return new Response("Unauthorized", { status: 401 })
      }

      await deleteDownload(parseInt(id, 10), authData.user_id)
      return Response.json({})
    } catch (error) {
      console.log(error);
      return new Response("Server error", { status: 500 })
    }
  }
}