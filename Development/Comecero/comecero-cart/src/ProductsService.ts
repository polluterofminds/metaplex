//  @ts-ignore
import axios from 'axios'
import {BASE_API_URL} from './config'
import { getCookie } from './utils';
// ProductService.ts
// Function to get product list
export const getProductList = async (params: any) => {
  try {
    let token = getCookie("token")
    if(!token) {
      //  Go get a limited token and store it
      await axios.get(`${BASE_API_URL}/auths/limited?timezone=UTC&account_id=BQ3422&test=true&user_locale=en-US
`)
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.get(`${BASE_API_URL}/products`, { params });
    return response.data; // Adjust this based on your actual API response
  } catch (error) {
    console.error('Error fetching product list:', error);
    throw error; // Propagate the error so it can be handled by the caller
  }
};

// You can add more functions here as needed for your service

