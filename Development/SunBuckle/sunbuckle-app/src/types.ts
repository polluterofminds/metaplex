// STORES

export type Store = {
  id?: string;
  created_at: string;
  updated_at: string;
  name: string;
  user_id: string;
  logo?: string;
  tagline?: string;
  primary_color?: string;
  secondary_color?: string;
  custom_domain?: string;
  header_image?: string;
}

export type StoreQuery = {
  name?: string;
  limit?: number;
  offset?: number;
}

// PRODUCTS

export type Products = {
  id?: number;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  price: number; // price is in cents
  tax_inclusive?: boolean;
  limit_inventory?: boolean;
  inventory_available?: number;
  images?: ProductImages[];
  store_id: number;
  user_id?: string;
}

export type ProductImages = {
  id?: number;
  created_at: string;
  product_id: number;
  image_url: string;
}

export type ProductQuery = {
  name?: string;
  limit?: number;
  offset?: number;
  includeImages?: boolean
}