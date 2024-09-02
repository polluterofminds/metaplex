import React, { useState, useEffect } from 'react';
import { getProductList } from '../ProductsService';
import { useSettings } from '../hooks/useSettings';
import { BASE_API_URL } from '../config';
import axios from 'axios';
import { addItemToCart, createNewCart, getCurrentCart } from '../CartService';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { getCookie } from '../utils';
import Footer from './Footer';
// import { getProductList } from '../ProductsService'; // Import your service here
// import CurrencyService from './CurrencyService';
// import GeoService from './GeoService';
// import SettingsService from '../SettingsService';

const Products = () => {
  const [data, setData] = useState<any>({
    products: { data: [] },
    error: null,
    params: {
      expand: "items.product,items.subscription_terms,customer.payment_methods",
      show: "product_id,name,price,currency,description,images.*",
      currency: "USD",//CurrencyService.getCurrency(),
      formatted: true,
      limit: 50
    }
  });

  const [geo, setGeo] = useState<any>({});
  const { settings, languages, selectedLanguage } = useSettings();
  const navigate = useNavigate()
  useEffect(() => {
    // Load settings and geo data
    // setGeo(GeoService.getData());
    // setSettings(SettingsService.get());

    // Load products using ProductService
    getProductList(data.params)
      .then((products: any) => {
        console.log(products)
        setData((prevData: any) => ({ ...prevData, products }));
      })
      .catch((error) => {
        setData((prevData: any) => ({ ...prevData, error }));
      });
  }, []); // Empty dependency array to mimic componentDidMount

  const onAddToCart = async (product: any) => {
    //  Create or get cart
    let cartId = getCookie("cart_id")
    if(!cartId) {
      await createNewCart(product)
    }
    //  Get current cart
    const cart = await getCurrentCart()
    let items: any = []
    if(cart && cart.items) {
      items.push(product)
      items = [...items, ...cart.items]
    }
    //  @TODO determine user_locale
    await addItemToCart(items)
    navigate("/cart")
    // Navigate to the cart
  };

  useEffect(() => {
    if (data.error) {
      window.scrollTo(0, 0);
    }
  }, [data.error]);

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] w-3/4 m-auto flex flex-col justify-between min-h-screen">
        <div>
          <div className="row spacer-t12">
            <div className="col-xs-12 col-sm-6">
              {settings?.account?.currencies && settings?.account?.currencies.length > 1 && (
                <div className="dropdown pull-right currency-button">
                  <button className="btn btn-default btn-sm dropdown-toggle" type="button">
                    <span className="pointer">{data.params.currency}</span> <i className="caret"></i>
                  </button>
                  {/* Dropdown menu for currency selection */}
                  {/* Implement the currency-select dropdown as a separate component */}
                </div>
              )}
              {settings?.app?.enable_languages && (
                <div className="dropdown pull-right spacer-r12">
                  <button className="btn btn-default btn-sm dropdown-toggle" type="button">
                    <i className="fa fa-globe"></i> <span className="pointer">{/* Language display here */}</span> <i className="caret"></i>
                  </button>
                  {/* Dropdown menu for language selection */}
                  {/* Implement the language-select dropdown as a separate component */}
                </div>
              )}
            </div>
          </div>

          {data.error && (
            <div className="row spacer-t12">
              <div className="col-xs-12">
                <div className="alert alert-danger">
                  {data.error.message}
                </div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 grid-cols-1">
            {data.products.data.map((product: any, index: number) => (
              <div key={index} onClick={() => onAddToCart(product)} className="flex flex-col justify-between h-full cursor-pointer">
                <div className="rounded-md">
                  {product.images && product.images.length > 0 ? (
                    <img
                      className="rounded-md product-icon border border-gray-700 object-cover w-full h-60"
                      src={settings?.app?.use_square_images ? product.images[0].link_square : product.images[0]?.link_small}
                      alt={product.name}
                    />
                  ) : (
                    <div className="rounded-md bg-orange-200 border border-gray-700 w-full h-60"></div>
                  )}
                </div>
                <div>
                  <p className="font-light text-sm">{product.name}</p>
                  <div className="mb-4 text-lg font-bold hover:underline">{product.formatted?.price}</div>
                  <div className="text-ellipsis	h-28 overflow-hidden" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p>Powered by <a className="underline" href="https://comecero.com" target="_blank" rel="noopenner noreferrer">Comecero</a></p>
          {/* Custom Footer, if supplied */}
          {settings?.style && settings.style.footer_html ? (
            <div className="py-4" dangerouslySetInnerHTML={{ __html: settings.style.footer_html }} />
          ) :
            <Footer />
          }
        </div>
      </div>
    </div>
  );
};

export default Products;
