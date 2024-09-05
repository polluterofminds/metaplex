import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../hooks/useSettings';
// import { Link } from 'react-router-dom';
// import Navbar from './Navbar';
import { addItemToCart, createNewCart, getCurrentCart, payWithCardFromCart, updateCartWithCustomerInfo } from '../../CartService';
import { CardDetails, Cart, CartItem, FormAddress } from '../../types';
import { Link } from 'react-router-dom';
import Item from './Item';
import { getCookie } from '../../utils';
import CardForm from './CardForm';

const CartComponent = () => {
  const { settings, languages } = useSettings()
  const [data, setData] = useState<Cart | null>(null);
  const [customerInfo, setCustomerInfo] = useState<FormAddress>({
    address_line_one: "",
    address_line_two: "",
    city: "",
    state_or_provinence: "",
    country: "US",
    postal_code: "",
    full_name: "",
    email: ""
  })
  const [ccDetails, setCCDetails] = useState<CardDetails>({
    card: "",
    expMonth: "",
    expYear: "",
    cvv: ""
  })
  const customerInfoRef = useRef(customerInfo);

  useEffect(() => {
    customerInfoRef.current = customerInfo;
  }, [customerInfo]);

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

  const updateCart = async () => {
    const currentCustomerInfo = customerInfoRef.current;
    //  Get current cart
    const cart = await getCurrentCart()
    const items = cart.items;
    //  @TODO determine user_locale
    await updateCartWithCustomerInfo(items, currentCustomerInfo)
    getCart();
  }

  const increaseCount = async (product: CartItem) => {
    let cartId = getCookie("cart_id")
    if (!cartId) {
      await createNewCart(product)
    }
    //  Get current cart
    const cart = await getCurrentCart()
    const items = cart.items;
    const i = items.find((p: CartItem) => p.product_id === product.product_id)
    if (i) {
      i.quantity = i.quantity + 1;
    }
    console.log(items)
    //  @TODO determine user_locale
    await addItemToCart(items)
    getCart();
  }

  const decreaseCount = async (product: CartItem) => {
    let cartId = getCookie("cart_id")
    if (!cartId) {
      await createNewCart(product)
    }
    //  Get current cart
    const cart = await getCurrentCart()
    const items = cart.items;
    const i = items.find((p: CartItem) => p.product_id === product.product_id)
    if (i && i.quantity > 1) {
      i.quantity = i.quantity - 1;
    }
    //  @TODO determine user_locale
    await addItemToCart(items)
    getCart();
  }

  const deleteItem = async (product: CartItem) => {
    let cartId = getCookie("cart_id")
    if (!cartId) {
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

  const submitPayment = async () => {
    const result = await payWithCardFromCart(ccDetails, customerInfo, true);
    
    return result;
  }

  return (
    <div>
      <div className="flex flex-col justify-between min-h-screen">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardForm submitPayment={submitPayment} ccDetails={ccDetails} setCCDetails={setCCDetails} updateCart={updateCart} settings={settings} customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
            <div className="order-1 md:order-2 p-4 bg-orange-200 flex flex-col justify-between md:min-h-screen">
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
                  data && data.items && data.items.length > 0 ? (
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
                          <p>Taxes {customerInfo.postal_code === "" && "(address required)"}</p>
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
                  ) :
                    <div>
                      <h4>There are no items in your cart</h4>
                      {
                        settings?.app?.show_continue_shopping &&
                        <a className="btn btn-default spacer-t24" href={getShoppingUrl() || ""}>
                          Continue Shopping
                        </a>
                      }
                    </div>
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
