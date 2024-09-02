import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
// import { Link } from 'react-router-dom';
// import Navbar from './Navbar';
import { addItemToCart, createNewCart, getCurrentCart } from '../../CartService';
import { Cart, CartItem } from '../../types';
import { Link } from 'react-router-dom';
import Item from './Item';
import { getCookie } from '../../utils';

const CartComponent = () => {
  const { settings, languages } = useSettings()
  const [data, setData] = useState<Cart | null>(null);

  // Example functions to mimic AngularJS behavior
  const getShoppingUrl = () => settings?.app?.main_shopping_url;

  useEffect(() => { 
    getCart()
  }, []);

  const getCart = async () => {
    const cartData: Cart = await getCurrentCart()
    if (cartData) {
      console.log(cartData)
      setData(cartData)
    }
  }

  const increaseCount = async (product: CartItem) => {    
    let cartId = getCookie("cart_id")
    if(!cartId) {
      await createNewCart(product)
    }
    //  Get current cart
    const cart = await getCurrentCart()
    const items = cart.items;
    const i = items.find((p: CartItem) => p.product_id === product.product_id)
    if(i) {
      i.quantity = i.quantity + 1;    
    }    
    console.log(items)
    //  @TODO determine user_locale
    await addItemToCart(items)
    getCart();
  }

  const decreaseCount = async (product: CartItem) => {    
    let cartId = getCookie("cart_id")
    if(!cartId) {
      await createNewCart(product)
    }
    //  Get current cart
    const cart = await getCurrentCart()
    const items = cart.items;
    const i = items.find((p: CartItem) => p.product_id === product.product_id)
    if(i && i.quantity > 1) {
      i.quantity = i.quantity - 1;    
    }    
    console.log(items)
    //  @TODO determine user_locale
    await addItemToCart(items)
    getCart();
  }

  const deleteItem = async (product: CartItem) => {
    let cartId = getCookie("cart_id")
    if(!cartId) {
      await createNewCart(product)
    }
    //  Get current cart
    const cart = await getCurrentCart()
    const items = cart.items;
    
    const updatedItems = items.filter((p: CartItem) => p.product_id !== product.product_id)
    //  @TODO determine user_locale
    await addItemToCart(updatedItems)
    getCart();
  }

  return (
    <div>
      <div className="flex flex-col justify-between min-h-screen">
        <div className="">
          {/* Error Message */}
          {/* {data?.error && (
            <div className="row spacer-t12">
              <div className="col-xs-12">
                <div className="alert alert-danger">{data?.error?.message}</div>
              </div>
            </div>
          )} */}

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
            <div className="order-1 md:order-2 p-4 bg-orange-200 flex flex-col justify-between min-h-screen">
              <div className="w-full">
                {settings?.style && settings?.style.header_html ? (
                  <div dangerouslySetInnerHTML={{ __html: settings.style.header_html }} />
                ) :
                  <nav className="flex items-center justify-between w-3/4 m-auto max-width-[1200px] py-4">
                    {settings?.style?.logo ? (
                      <Link to="/"><img src={settings.style.logo} alt="Logo" /></Link>
                    ) : (
                      <Link to="/"><span className="text-xl font-bold">{settings?.app?.company_name}</span></Link>
                    )}
                  </nav>}
                {
                  data && data.items && data.items.length > 0 && (
                    <div className="row spacer-t12">
                      {
                        data.items.map((i: CartItem, index: number) => {
                          return (
                            <div key={index}>
                              <Item cartItem={i} increaseCount={increaseCount} decreaseCount={decreaseCount} deleteItem={deleteItem} />
                            </div>
                          )
                        })
                      }
                      <div className="w-3/4 m-auto mt-8">
                        <div className="flex items-center justify-between">
                          <p>Subtotal</p>
                          <p className="ml-4 font-bold">{data.formatted.subtotal}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p>Taxes</p>
                          <p className="ml-4 font-bold">{data.formatted.tax}</p>                                              
                        </div>
                        {
                            data.formatted.shipping && data.formatted.shipping !== "$0.00" &&
                            <div className="flex items-center justify-between">
                            <p>Shipping</p>
                            <p className="ml-4 font-bold">{data.formatted.shipping}</p>
                          </div>
                          }      
                        <div className="flex items-center justify-between mt-4">
                          <p>Total</p>
                          <p className="ml-4 font-bold">{data.formatted.total}</p>
                        </div>
                      </div>
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
