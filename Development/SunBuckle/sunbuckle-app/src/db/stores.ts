import { getRequestContext } from "@cloudflare/next-on-pages";
import { createClient } from '@supabase/supabase-js'
import { Store, StoreQuery } from "../types";

export const supabase = createClient(getRequestContext().env.SUPABASE_URL, getRequestContext().env.SUPABASE_SERVICE_KEY)

export const insertStore = async (store: Store) => {
  const { data, error } = await supabase
    .from('stores')
    .insert([
      store,
    ])
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const updateStore = async (store: Store) => {
  const { data, error } = await supabase
    .from('stores')
    .update(store)
    .eq('id', store.id)
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

export const getStores = async (userId: string, query?: StoreQuery) => {
  const limit = query?.limit || 10;
  const name = query?.name || null;
  const offset = query?.offset || 0;

  // Start by selecting from the stores table
  let baseQuery = supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .range(offset, offset + limit);

  // Add name filter conditionally
  if (name) {
    baseQuery = baseQuery.eq('name', name);
  }

  const { data, error } = await baseQuery;

  if (error) {
    throw error;
  }

  return data;
};


export const getStoreById = async (id: number) => {
  let { data, error } = await supabase
    .from('stores')
    .select("*")
    .eq('id', id)

    if(error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      return data[0]
    } else {
      return {}
    }
}

export const getStoreByUserIdAndStoreId = async (userId: string, storeId: number) => {
  let { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .eq("user_id", userId)

  if(error) {
    throw error;
  }

  return data;
}