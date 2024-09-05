import React, { useCallback, useState } from 'react'
import { CardDetails, Country, FormAddress } from '../../types';
import { countries } from '../../countries';
import { payWithCardFromCart } from '../../CartService';
import { deleteCookie } from '../../utils';



type CardFormProps = {
  settings: any;
  customerInfo: FormAddress
  setCustomerInfo: (details: any) => void;
  updateCart: () => void;
  ccDetails: CardDetails
  setCCDetails: (details: any) => void;
  submitPayment: () => void;
}

const CardForm = (props: CardFormProps) => {
  const { settings, ccDetails, setCCDetails } = props;

  const [expValue, setExpValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedUpdateCart = useCallback(debounce(() => {
    props.updateCart();
  }, 600), []);

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "postal_code") {
      //  debounce function to call updateCart with 600ms wait
      debouncedUpdateCart(value);
    }
    props.setCustomerInfo((prevInfo: FormAddress) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleCreditCardInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCCDetails((prevInfo: CardDetails) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleExpiration = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9/]/g, '');
    if (value.length < 6) {
      if (value.length === 2 && !value.includes("/")) {
        value = value + "/"
      } else if (value.length === 3 && value.includes("/")) {
        value = value.slice(0, 2);
      }

      setExpValue(value);
    }


    setCCDetails((prevInfo: CardDetails) => ({
      ...prevInfo,
      expMonth: value.substring(0, 2) || "",
      expYear: value.substring(3, 5) || ""
    }));
  }

  const handlePay = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    const result: any = await props.submitPayment();
    if (result.success) {
      setSubmitting(false);
      setSuccess(true);   
      deleteCookie("cart_id");   
      if(settings.app.receipt_redirect_url) {
        setTimeout(() => {
          window.location.replace(settings.app.receipt_redirect_url)
        }, 800)
      }
    } else {
      //  Handle errors
    }
  }

  return (
    <div className="order-2 md:order-1 px-10">
      <h3 className="text-xl mt-8">Pay by credit card</h3>
      <form onSubmit={handlePay}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                required
                value={props.customerInfo.email} onChange={(e) => handleCustomerInfoChange(e)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-full">
            <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-gray-900">
              Full name
            </label>
            <div className="mt-2">
              <input
                required
                value={props.customerInfo.full_name}
                onChange={(e) => handleCustomerInfoChange(e)}
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="given-name"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
              Country
            </label>
            <div className="mt-2">
              <select
                required
                value={props.customerInfo.country} // Step 2: Set the value to the state
                onChange={handleCustomerInfoChange}
                id="country"
                name="country"
                autoComplete="country-name"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {
                  countries.map((c: Country) => {
                    return (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="address_line_one" className="block text-sm font-medium leading-6 text-gray-900">
              Street address line 1
            </label>
            <div className="mt-2">
              <input
                required
                value={props.customerInfo.address_line_one}
                onChange={(e) => handleCustomerInfoChange(e)}
                id="address_line_one"
                name="address_line_one"
                type="text"
                autoComplete="street-address"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="address_line_two" className="block text-sm font-medium leading-6 text-gray-900">
              Street address line 2
            </label>
            <div className="mt-2">
              <input
                value={props.customerInfo.address_line_two}
                onChange={(e) => handleCustomerInfoChange(e)}
                id="address_line_two"
                name="address_line_two"
                type="text"
                autoComplete="street-address"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
              City
            </label>
            <div className="mt-2">
              <input
                required
                value={props.customerInfo.city}
                onChange={(e) => handleCustomerInfoChange(e)}
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="state_or_provinence" className="block text-sm font-medium leading-6 text-gray-900">
              State / Province
            </label>
            <div className="mt-2">
              <input
                required
                value={props.customerInfo.state_or_provinence}
                onChange={(e) => handleCustomerInfoChange(e)}
                id="state_or_provinence"
                name="state_or_provinence"
                type="text"
                autoComplete="address-level1"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="postal_code" className="block text-sm font-medium leading-6 text-gray-900">
              ZIP / Postal code
            </label>
            <div className="mt-2">
              <input
                required
                value={props.customerInfo.postal_code}
                onChange={handleCustomerInfoChange}
                id="postal_code"
                name="postal_code"
                type="text"
                autoComplete="postal-code"
                className="px-2 outline-orange-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Payment Methods */}
          {
            settings?.account?.payment_method_types?.includes("credit_card") &&
            <>
              <div className="col-span-3">
                <label htmlFor="card" className="block text-sm font-medium leading-6 text-gray-900">
                  Card number
                </label>
                <div className="mt-2">
                  <input
                    required
                    value={ccDetails.card}
                    onChange={handleCreditCardInfoChange}
                    id="card"
                    name="card"
                    type="password"
                    autoComplete="card"
                    className="outline-orange-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="expiration" className="block text-sm font-medium leading-6 text-gray-900">
                  Expiration
                </label>
                <div className="mt-2">
                  <input
                    required
                    value={expValue}
                    onChange={handleExpiration}
                    id="expiration"
                    name="expiration"
                    type="text"
                    autoComplete="expiration"
                    className="outline-orange-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label htmlFor="cvv" className="block text-sm font-medium leading-6 text-gray-900">
                  CVV
                </label>
                <div className="mt-2">
                  <input
                    required
                    value={ccDetails.cvv}
                    onChange={handleCreditCardInfoChange}
                    id="cvv"
                    name="cvv"
                    type="number"
                    maxLength={3}
                    autoComplete="cvv"
                    className="outline-orange-200 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-200 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </>
          }


          <button type="submit" className="mb-10 w-full rounded-md py-2 px-6 bg-blue-500 text-white">
            {submitting ? "Hang tight..." : success ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 relative">
                  <div className="w-6 h-6 rounded-full border-2 border-green-500 animate-pulse-once"></div>
                  <svg className="w-4 h-4 absolute inset-0 m-auto text-green-500 stroke-current animate-spin-checkmark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ) : "Pay"}
          </button>

        </div>
      </form>
      <div className="md:hidden block mt-8">
        <p>Powered by <a className="underline" href="https://comecero.com" target="_blank" rel="noopenner noreferrer">Comecero</a></p>
      </div>
    </div>
  )
}

export default CardForm