import { getDownloadsByUserIdAndDownloadId } from "./db/downloads"
import { getProductImagesByUserIdAndProductId } from "./db/product_images"
import { getProductByUserIdAndProductId } from "./db/products"
import { getStoreByUserIdAndStoreId } from "./db/stores"

export const isAuthenticated = async (req: Request) => {
  //  @TODO change this
  return {
    authorized: true, 
    user_id: "019201cb-761a-7ada-b765-331dba43f450"
  }
}

export const canAddProductToStore = async (userId: string, storeId: number) => {
  const stores = await getStoreByUserIdAndStoreId(userId, storeId)
  if(stores && stores.length > 0) {
    return true;
  } else {
    return false;
  }
}

export const canMakeChangesToProduct = async (userId: string, productId: number) => {
  const products = await getProductByUserIdAndProductId(userId, productId)
  if(products && products.length > 0) {
    return true;
  } else {
    return false;
  }
}

export const canMakeChangesToProductImage = async (userId: string, imageId: number) => {
  const images = await getProductImagesByUserIdAndProductId(userId, imageId)
  if(images && images.length > 0) {
    return true;
  } else {
    return false;
  }
}

export const canMakeChangesToDownload = async (userId: string, downloadId: number) => {
  const downloads = await getDownloadsByUserIdAndDownloadId(userId, downloadId)
  if(downloads && downloads.length > 0) {
    return true;
  } else {
    return false;
  }
}