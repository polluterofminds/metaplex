//  @ts-ignore
import axios from 'axios'
import { BASE_API_URL } from './config'
import { getCookie, storeCookie } from './utils';

export const createNewCart = async (product: any, currency?: string) => {
  try {
    const token = getCookie("token")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post(`${BASE_API_URL}/carts`, {
      "currency": currency || "USD",
      "items": [
        {
          "product_id": product.product_id,
          "quantity": 1
        }
      ]      
    })

    const data = response.data;
    storeCookie("cart_id", data.cart_id)
  } catch (error) {

  }
}

export const addItemToCart = async (items: any) => {
  try {
    const token = getCookie("token")
    const cart_id = getCookie("cart_id")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const response = await axios.post(`${BASE_API_URL}/carts/${cart_id}??timezone=UTC&expand=items.product,items.subscription_terms,customer.payment_methods,options,options.user_agent_payment_request,cross_sells.product&formatted=true&hide=items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified&user_locale=en-US`, {
      "items": items,
      "customer": {
        "billing_address": {},
        "shipping_address": {}
      },
      "currency": "USD"
    })
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching product list:', error);
    throw error;
  }
};

export const getCurrentCart = async () => {
  try {
    const token = getCookie("token")
    const cart_id = getCookie("cart_id")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios(`${BASE_API_URL}/carts/${cart_id}?timezone=UTC&formatted=true&options=true&user_locale=en-US&expand=items.product`)
    return response.data
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

