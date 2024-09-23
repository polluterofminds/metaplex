import { getRequestContext } from "@cloudflare/next-on-pages";
import { createClient } from '@supabase/supabase-js'
import { ProductQuery, Products } from "../types";

export const supabase = createClient(getRequestContext().env.SUPABASE_URL, getRequestContext().env.SUPABASE_SERVICE_KEY)

export const insertProduct = async (product: Products) => {
  const { data, error } = await supabase
    .from('products')
    .insert([
      product,
    ])
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const getProducts = async (userId: string, query?: ProductQuery) => {
  const limit = query?.limit || 10;
  const name = query?.name || null;
  const offset = query?.offset || 0;
  const includeImages = query?.includeImages || false;

  // Start by selecting from the products table
  let baseQuery: any = supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .range(offset, offset + limit);

  // Add filters conditionally
  if (name) {
    baseQuery = baseQuery.eq('name', name);
  }

  // Modify the select statement if includeImages is true
  if (includeImages) {
    baseQuery = baseQuery.select('*, product_images(*)'); // Assuming 'images' is a related table or column
  }

  const { data, error } = await baseQuery;

  if (error) {
    throw error;
  }

  return data;
};

export const getProductById = async (id: number, includeImages?: string | null) => {
  let baseQuery: any = supabase
    .from('products')
    .select("*")
    .eq('id', id)

  if (includeImages) {
    baseQuery = baseQuery.select('*, product_images(*)'); // Assuming 'images' is a related table or column
  }

  const { data, error } = await baseQuery;

  if (error) {
    throw error;
  }

  if (data && data.length > 0) {
    return data[0]
  } else {
    return {}
  }
}

export const updateProduct = async (product: Products) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', product.id)
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const deleteStore = async (id: number, userId: string) => {
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw error;
  }
}

export const getProductByUserIdAndProductId = async (userId: string, productId: number) => {
  let { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("user_id", userId)

  if(error) {
    throw error;
  }

  return data;
}

export const deleteProduct = async (id: number, userId: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw error;
  }
}