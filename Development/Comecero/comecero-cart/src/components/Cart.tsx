import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { getCurrentCart } from '../CartService';
import Footer from './Footer';
import { Cart, CartItem } from '../types';

const CartComponent = () => {
  const { settings, languages } = useSettings()
  const [data, setData] = useState<any>({
    cart: { items: [], cross_sells: { data: [] }, formatted: { subtotal: '', total: '', discount: '', tax: '', currency: '' }, options: { shipping_quotes: [] }, shipping_item: { price: '', price_original: '', formatted: { total_original: '', subtotal_original: '' } } },
    shipping_is_billing: false,
    payment_method: { payment_method_id: '', data: { number: '', exp_month: '', exp_year: '', cvv: '' }, save: false },
    error: null,
    language: '',
    currency: ''
  });

  // Example functions to mimic AngularJS behavior
  const getShoppingUrl = () => settings?.app?.main_shopping_url;

  useEffect(() => {
    const getCart = async () => {
      const cartData: Cart = await getCurrentCart()
      if (cartData) {
        console.log(cartData)
        setData(cartData)
      }
    }

    getCart()
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex flex-col justify-between min-h-screen">
        <div className="">
          {/* Error Message */}
          {data?.error && (
            <div className="row spacer-t12">
              <div className="col-xs-12">
                <div className="alert alert-danger">{data?.error?.message}</div>
              </div>
            </div>
          )}

          {/* Empty Cart Message */}
          {data && data.items && data.items.length === 0 && (
            <div className="row spacer-t12">
              <div className="col-md-12 text-center">
                <div className="panel panel-default panel-content">
                  <div className="panel-body padding-t36 padding-b36">
                    <div className="section">
                      <div className="section-body padding-t12 padding-b24">
                        <div className="row">
                          <div className="col-xs-12">
                            <h4>There are no items in your cart</h4>
                            {
                              settings?.app?.show_continue_shopping &&
                              <a className="btn btn-default spacer-t24" href={getShoppingUrl() || ""}>
                                Continue Shopping
                              </a>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="order-2 md:order-1 px-10">
              <form>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Payment Methods */}
                  {
                    settings?.account?.payment_method_types?.includes("credit_card") &&
                    <div className="col-span-full">
                      <label htmlFor="credit-card" className="block text-sm font-medium leading-6 text-gray-900">
                        Card number
                      </label>
                      <div className="mt-2">
                        <input
                          id="credit-card"
                          name="credit-card"
                          type="password"
                          autoComplete="credit-card"
                          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  }


                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="family-name"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                      Country
                    </label>
                    <div className="mt-2">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        id="street-address"
                        name="street-address"
                        type="text"
                        autoComplete="street-address"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        id="region"
                        name="region"
                        type="text"
                        autoComplete="address-level1"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        id="postal-code"
                        name="postal-code"
                        type="text"
                        autoComplete="postal-code"
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="md:hidden block mt-8">
                <p>Powered by <a className="underline" href="https://comecero.com" target="_blank" rel="noopenner noreferrer">Comecero</a></p>
              </div>
            </div>
            <div className="order-1 md:order-2 p-4 bg-orange-200">
              <div className="w-full">
                {
                  data && data.items && data.items.length > 0 && (
                    <div className="row spacer-t12 divide-y divide-gray-700">
                      {
                        data.items.map((i: CartItem, index: number) => {
                          return (
                            <div className="w-3/5 m-auto py-4" key={index}>
                              <h3 className="text-xl">{i.name}</h3>
                              <p>{i.product.description}</p>
                              {i.product.images.length > 0 &&
                                <img className="mt-4 w-full rounded-sm border border-gray-700" src={i.product.images[0].link_small} alt={i.product.name} />
                              }
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
              </div>
              <div className="hidden md:block mt-8">
                <p>Powered by <a className="underline" href="https://comecero.com" target="_blank" rel="noopenner noreferrer">Comecero</a></p>
              </div>
            </div>
          </div>
        </div >
      </div >
    </div >
  );
};

export default CartComponent;

// Helper components like CustomHtml and Dropdown would need to be defined separately.
