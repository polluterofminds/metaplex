export type Currency = {
  "code": string,
  "name": string
}

export type Lang = {
  code: string;
  name: string;
};

export interface Settings {
  style: any,
  app: {
    "account_id": string,
    "test": boolean,
    "company_name": string,
    "use_square_images": boolean,
    "form_label_position": string,
    "footer_text": string | null,
    "error_notifications": string,
    "show_promo_code": boolean,
    "promo_code_name": string,
    "hide_quantity": boolean,
    "exp_select": boolean,
    "ask_save_cards": boolean,
    "show_digital_delivery": boolean,
    "enable_languages": boolean,
    "show_continue_shopping": boolean,
    "upsell_prompt": string,
    "cross_sell_position": string,
    "cross_sell_heading": string,
    "cross_sell_items": string,
    "receipt_button_position": string,
    "receipt_button_text": string,
    "receipt_button_text_custom": string | null,
    "receipt_button_url": string,
    "main_shopping_url": string | null,
    "not_found_url": string,
    "fields": string | null
  },
  account: {
    "development": boolean,
    "api_host": string,
    "account_id": string,
    "test": boolean,
    "allow_save_cards": boolean,
    "global_footer_html": string | null,
    "currencies": Currency[],
    "payment_method_types": string[],
    "allow_customer_subscription_cancel": boolean,
    "company_name": string,
    "support_website": string,
    "support_email": string,
    "date_utc": string,
    "browser_info": {
      "accept_language": string,
      "locale": string,
      "language": string,
      "accept": string,
      "user_agent": string
    }
  }
}

export interface Cart {
  object: string;
  url: string;
  cart_id: string;
  date_created: string;
  date_modified: string;
  test: boolean;
  account_id: string;
  order_id: string;
  open: boolean;
  payment_status: string;
  currency: string;
  subtotal: number;
  subtotal_original: number;
  shipping: number;
  shipping_original: number;
  discount: number;
  item_discounts: number;
  total_discounts: number;
  total_discounts_percent: number;
  tax: number;
  tax_original: number;
  total: number;
  total_original: number;
  tax_inclusive: boolean;
  total_payments: number;
  total_remaining: number;
  discount_on_gross: boolean;
  customer_ip_address: string;
  customer_ip_country: string;
  referrer: string | null;
  affiliate_id: string | null;
  promotion_code: string | null;
  items_count: number;
  items_quantity: number;
  items: CartItem[];
  shipping_item: ShippingItem;
  customer: Customer;
  order: Order | null;
  payments: string;
  promotions: string;
  options: string;
  meta: any;
  related_products: string;
  cross_sells: string;
  up_sells: string;
  formatted: FormattedCart;
}

export interface CartItem {
  object: string;
  url: string;
  item_id: string;
  cross_sell_id: string | null;
  up_sell_id: string | null;
  date_created: string;
  date_modified: string;
  product_id: string;
  cart_id: string;
  name: string;
  type: string;
  quantity: number;
  currency: string;
  price: number;
  price_original: number;
  subtotal: number;
  subtotal_original: number;
  discount: number;
  discount_percent: number;
  tax: number;
  tax_original: number;
  total: number;
  total_original: number;
  tax_rate: number;
  product: Product;
  subscription_plan: string | null;
  subscription_terms: string | null;
  meta: any;
  formatted: FormattedItem;
}

interface Product {
  object: string;
  url: string;
  product_id: string;
  date_created: string;
  date_modified: string;
  test: boolean;
  account_id: string;
  name: string;
  price: number;
  currency: string;
  compare_at_price: number | null;
  type: string;
  description: string;
  headline: string | null;
  tax_code: string | null;
  prices: Price[];
  volume_prices: any[];
  effective_volume_prices: any[];
  inventory: Inventory | null;
  has_file: boolean;
  has_license_service: boolean;
  subscription_plan: string | null;
  subscription_terms: string | null;
  images: Image[];
  video_url: string | null;
  related_products: string;
  subscription_change_products: string;
  subscription_term_change_products: string;
  meta: any;
  formatted: FormattedProduct;
}

interface Price {
  price: number;
  currency: string;
  formatted: {
    price: string;
  };
}

interface Inventory {
  in_stock: boolean;
  allow_oversells: boolean;
  quantity: number;
}

interface Image {
  object: string;
  url: string;
  image_id: string;
  date_created: string;
  date_modified: string;
  test: boolean;
  account_id: string;
  link: string;
  link_small: string;
  link_medium: string;
  link_large: string;
  link_square: string;
  filename: string;
  formatted: {
    date_created: string;
    date_modified: string;
  };
}

interface ShippingItem {
  url: string;
  item_id: string;
  cross_sell_id: string | null;
  up_sell_id: string | null;
  date_created: string;
  date_modified: string;
  name: string;
  type: string;
  quantity: number;
  currency: string;
  price: number;
  price_original: number;
  subtotal: number;
  subtotal_original: number;
  discount: number;
  discount_percent: number;
  tax: number;
  tax_original: number;
  total: number;
  total_original: number;
  tax_rate: number;
  meta: any;
  formatted: FormattedItem;
}

interface Customer {
  object: string;
  url: string;
  customer_id: string;
  date_created: string;
  date_modified: string;
  account_id: string;
  test: boolean;
  company_name: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  billing_address: Address;
  shipping_address: Address;
  username: string | null;
  tax_number: string | null;
  tax_exempt: boolean;
  has_payments: boolean;
  locale: string;
  meta: any;
  payment_methods: string;
  payments: string;
  refunds: string;
  orders: string;
  subscriptions: string;
  invoices: string;
  balance: string;
  formatted: FormattedCustomer;
}

interface Address {
  object: string;
  name: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  state_prov: string | null;
  postal_code: string | null;
  country: string;
  email: string | null;
  meta: any;
  formatted: {
    country: string;
  };
}

interface Order {
  // Define the properties of an Order object if needed
}

interface FormattedCart {
  subtotal: string;
  subtotal_original: string;
  shipping: string;
  shipping_original: string;
  discount: string;
  item_discounts: string;
  total_discounts: string;
  total_discounts_percent: string;
  tax: string;
  tax_original: string;
  total: string;
  total_original: string;
  total_payments: string;
  total_remaining: string;
  customer_ip_country: string;
  date_created: string;
  date_modified: string;
}

interface FormattedItem {
  price: string;
  price_original: string;
  subtotal: string;
  subtotal_original: string;
  discount: string;
  discount_percent: string;
  tax: string;
  tax_original: string;
  total: string;
  total_original: string;
  tax_rate: string;
  date_created: string;
  date_modified: string;
}

interface FormattedProduct {
  price: string;
  compare_at_price: string | null;
  date_created: string;
  date_modified: string;
}

interface FormattedCustomer {
  date_created: string;
  date_modified: string;
}

export type FormAddress = {
  email: string;
  full_name: string;
  address_line_one: string;
  address_line_two: string;
  city: string;
  state_or_provinence: string;
  country: string;
  postal_code: string;
}

export type Country = {
  code: string;
  name: string;
}

export type CardDetails = {
  card: string; 
  expMonth: string; 
  expYear: string;
  cvv: string;
}