import { getRequestContext } from "@cloudflare/next-on-pages";
import { createClient } from '@supabase/supabase-js'
import { ProductImages, ProductQuery } from "../types";

export const supabase = createClient(getRequestContext().env.SUPABASE_URL, getRequestContext().env.SUPABASE_SERVICE_KEY)

export const insertProductImages = async (images: ProductImages[]) => {
  const { data, error } = await supabase
    .from('product_images')
    .insert(images)
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const getProductImagesByUserId = async (userId: string, query?: ProductQuery) => {
  const limit = query?.limit || 10;
  const offset = query?.offset || 0;

  // Start by selecting from the products table
  let baseQuery: any = supabase
    .from('product_images_for_user')
    .select('*')
    .eq('user_id', userId)
    .range(offset, offset + limit);

  const { data, error } = await baseQuery;

  if (error) {
    throw error;
  }

  return data;
}

export const deleteProductImage = async (id: number) => {
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', id)

  if (error) {
    throw error;
  }
}

export const getProductImagesByUserIdAndProductId = async (userId: string, id: number) => {
  let { data, error } = await supabase
    .from('product_images_for_user')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)

  if (error) {
    throw error
  }

  return data
}