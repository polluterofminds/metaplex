import { getRequestContext } from "@cloudflare/next-on-pages";
import { createClient } from '@supabase/supabase-js'
import { Download, ProductQuery, Products } from "../types";

export const supabase = createClient(getRequestContext().env.SUPABASE_URL, getRequestContext().env.SUPABASE_SERVICE_KEY)

export const insertDownload = async (download: Download) => {
  const { data, error } = await supabase
    .from('downloads')
    .insert([
      download,
    ])
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const getDownloadsByUserIdAndDownloadId = async (userId: string, downloadId: number) => {
  let { data, error } = await supabase
    .from('downloads')
    .select('*')
    .eq('user_id', userId)
    .eq('id', downloadId)

  if (error) {
    throw error
  }

  return data
}

export const getDownloads = async (userId: string, query?: ProductQuery) => {
  const limit = query?.limit || 10;
  const name = query?.name || null;
  const offset = query?.offset || 0;

  // Start by selecting from the products table
  let baseQuery: any = supabase
    .from('downloads')
    .select('*')
    .eq('user_id', userId)
    .range(offset, offset + limit);

  // Add filters conditionally
  if (name) {
    baseQuery = baseQuery.eq('file_name', name);
  }

  const { data, error } = await baseQuery;

  if (error) {
    throw error;
  }

  return data;
};

export const getDownloadById = async (id: number, userId: string) => {
  let baseQuery: any = supabase
    .from('downloads')
    .select("*")
    .eq('id', id)
    .eq('user_id', userId)

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

export const deleteDownload = async (id: number, userId: string) => {
  const { error } = await supabase
    .from('downloads')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw error;
  }
}