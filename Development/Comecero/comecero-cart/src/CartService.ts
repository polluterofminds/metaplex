//  @ts-ignore
import axios from 'axios'
import { BASE_API_URL } from './config'
import { getCookie, storeCookie } from './utils';
import { CardDetails, FormAddress } from './types';

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

export const updateCartWithCustomerInfo = async (items: any, customer: FormAddress) => {
  try {
    const token = getCookie("token")
    const cart_id = getCookie("cart_id")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await axios.post(`${BASE_API_URL}/carts/${cart_id}??timezone=UTC&expand=items.product,items.subscription_terms,customer.payment_methods,options,options.user_agent_payment_request,cross_sells.product&formatted=true&hide=items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified&user_locale=en-US`, {
      "items": items,
      "customer": {
        "billing_address": {
          "address_1": customer.address_line_one,
          "addres_2": customer.address_line_two,
          "city": customer.city,
          "state_prov": customer.state_or_provinence,
          "postal_code": customer.postal_code,
          "country": "US"
        },
        "shipping_address": {
          "address_1": customer.address_line_one,
          "addres_2": customer.address_line_two,
          "city": customer.city,
          "state_prov": customer.state_or_provinence,
          "postal_code": customer.postal_code,
          "country": "US"
        }
      },
      "currency": "USD"
    })
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching product list:', error);
    throw error;
  }
}

export const getCurrentCart = async () => {
  try {
    const token = getCookie("token")
    const cart_id = getCookie("cart_id")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios(`${BASE_API_URL}/carts/${cart_id}?timezone=UTC&expand=items.product,items.subscription_terms,customer.payment_methods,options,options.user_agent_payment_request,cross_sells.product&formatted=true&hide=items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified&user_locale=en-US`)
    return response.data
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export const payWithCardFromCart = async (cardDetails: CardDetails, customer: FormAddress, save: boolean) => {
  try {
    const token = getCookie("token")
  const cart_id = getCookie("cart_id")


  const body = {
    "capture": true,
    customer: {
      name: customer.full_name, 
      email: customer.email
    },
    "payment_method": {
      "save": save,
      "type": "credit_card",
      "data": {
        "number": cardDetails.card,
        "cvv": cardDetails.cvv,
        "exp_month": cardDetails.expMonth,
        "exp_year": `20${cardDetails.expYear}`, // We capture the two-digit year in the UI but the API expects a four-digit year
        "cardholder_name": customer.full_name,
        "billing_address": {
          "address_1": customer.address_line_one,
          "address_2": customer.address_line_two,
          "city": customer.city,
          "state_prov": customer.state_or_provinence,
          "postal_code": customer.postal_code,
          "country": customer.country
        },
        // "shipping_address":{
        //    "address_1":customer.address_line_one,
        //    "address_2": customer.address_line_two,
        //    "city":customer.city,
        //    "state_prov":customer.state_or_provinence,
        //    "postal_code":customer.postal_code,
        //    "country":customer.country
        // }
      }
    }
  }

  const res = await fetch(`https://api.comecero.com/api/v1/carts/${cart_id}/payments?timezone=UTC&expand=order,response_data,payment_method&formatted=true&hide=&user_locale=en-US`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": `Bearer ${token}`,
      "content-type": "application/json",
      // "priority": "u=1, i",
      "sec-ch-ua": "\"Not;A=Brand\";v=\"24\", \"Chromium\";v=\"128\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    },
    "referrer": window.location.origin,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify(body),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
  const data = await res.json()
  return {
    success: true, 
    data: data
  }
  } catch (error) {
    console.log(error);
    return {
      success: false
    };
  }  
  // await axios.post(`${BASE_API_URL}/${cart_id}/payments?timezone=UTC&expand=order,response_data,payment_method&formatted=true&hide=&user_locale=en-US`, body)
}

