import { Image, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi'
import { CartRetailItem, RetailItem } from './cart.types'
import ProductPrice from './product-price'
import Styles from './cart-item.module.css'

const totalAmount = 1234

interface Props {
  product: CartRetailItem
  setIsLoadingForCartCountChange: React.Dispatch<React.SetStateAction<boolean>>
  fetchCartData: () => Promise<void>
  onIncrement: (any) => void
  onDecrement: (slug: string) => void
  t: any
  locale: string
}
const CartItem: React.FC<Props> = ({
  product,
  setIsLoadingForCartCountChange,
  fetchCartData,
  onDecrement,
  onIncrement,
  t,
  locale
}) => {
  const [counter, setCounter] = useState(product?.quantity)

  const fetchQuotes = () => {
    setIsLoadingForCartCountChange(true)
    fetchCartData()
      .then(() => setIsLoadingForCartCountChange(false))
      .catch(e => console.error(e))
  }

  function increment(product: RetailItem) {
    setCounter(prev => ++prev!)
    onIncrement({ product: product, quantity: 1 })
    fetchQuotes()
  }

  function decrement(slug: string) {
    setCounter(prev => --prev!)
    onDecrement(slug)
    fetchQuotes()
  }

  function onInputNumberChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
      setCounter(+e.currentTarget.value)
    }
  }

  return (
    <div className={Styles.cart_item_layout_container}>
      <div className={Styles.prouct_details_container}>
        <a className={Styles.product_details}>
          <div className={Styles.product_image_container}>
            <Image src={product.descriptor.images[0]} alt={product.descriptor.name} className="object-contain" />
          </div>
          <div className={Styles.product_name}>{product.descriptor.name}</div>
        </a>
      </div>
      <div className={Styles.product_count_price_container}>
        <div className={Styles.product_counter_layout_container}>
          <div className={Styles.product_counter_container}>
            <div className={Styles.plus_icon_container} onClick={() => increment(product)}>
              <HiOutlinePlusSm className={Styles.plus_icon} />
            </div>
            <input
              className={Styles.product_counter_input}
              type="number"
              min={1}
              max={10}
              value={counter}
              onChange={onInputNumberChangeHandler}
            />
            {counter === 1 ? (
              <div className={Styles.delete_icon_container} onClick={() => decrement(product.id)}>
                <HiOutlineTrash className={Styles.delete_icon} />
              </div>
            ) : (
              <div onClick={() => decrement(product.id)} className={Styles.minus_icon_container}>
                <HiMinusSm className={Styles.minus_icon} />
              </div>
            )}
          </div>
        </div>
        <div className={Styles.total_amount_container}>
          <p>{totalAmount}</p>
          <ProductPrice t={t} locale={locale} price={parseFloat(product.price.value) * counter!} />
        </div>
      </div>
    </div>
  )
}

export default CartItem
