import React from 'react'
import { CartItem } from '../../types'

type ItemProps = {
  cartItem: CartItem
  increaseCount: (item: CartItem) => void
  decreaseCount: (item: CartItem) => void
  deleteItem: (item: CartItem) => void
}

const Item = (props: ItemProps) => {
  const i = props.cartItem;
  return (
    <div className="w-3/4 flex items-center m-auto py-4">
      {i.product.images.length > 0 ?
        <img className="w-16 h-auto rounded-sm border border-gray-700" src={i.product.images[0].link_small} alt={i.product.name} /> :
        <div className="w-16 mt-4 h-16 bg-gray-700 rounded-sm" />
      }
      <div className="ml-4">
        <h3 className="text-xl">{i.name}</h3>
        {
          i.product.subscription_plan === null &&
          <div className="border border-gray-700 p-2 rounded-sm flex flex-row items-center justify-between">
            <button onClick={() => props.decreaseCount(i)} disabled={i.quantity < 2}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <p>{i.quantity}</p>
            <button onClick={() => props.increaseCount(i)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        }
        <button onClick={() => props.deleteItem(props.cartItem)} className="mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>

        </button>
      </div>
    </div>
  )
}

export default Item