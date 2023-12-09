import { Image, Box, Divider } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi'

// Custom modules
import ProductPrice from './product-price'
import Styles from './cart-item.module.css'
import { CartItemProps } from './cart.types'

const CartItem: React.FC<CartItemProps> = ({
  id,
  quantity = 0,
  name,
  image,
  price,
  symbol,
  handleDecrement,
  handleIncrement,
  className
}) => {
  const [counter, setCounter] = useState(quantity)

  function increment() {
    setCounter(prev => ++prev!)
    handleIncrement()
  }

  function decrement() {
    setCounter(prev => --prev!)
    handleDecrement()
  }

  function onInputNumberChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
      setCounter(+e.currentTarget.value)
    }
  }

  return (
    <div className={className}>
      <div className={Styles.cart_item_layout_container}>
        <div className={Styles.prouct_details_container}>
          <a className={Styles.product_details}>
            <div className={Styles.product_image_container}>
              <Image
                src={image}
                alt={name}
                className="object-contain"
              />
            </div>
            <div className={Styles.product_name}>{name}</div>
          </a>
        </div>
        <div className={Styles.product_count_price_container}>
          <div className={Styles.product_counter_layout_container}>
            <div className={Styles.product_counter_container}>
              <div
                className={Styles.plus_icon_container}
                onClick={() => increment()}
              >
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
                <div
                  className={Styles.delete_icon_container}
                  onClick={() => decrement()}
                >
                  <HiOutlineTrash className={Styles.delete_icon} />
                </div>
              ) : (
                <div
                  onClick={() => decrement()}
                  className={Styles.minus_icon_container}
                >
                  <HiMinusSm className={Styles.minus_icon} />
                </div>
              )}
            </div>
          </div>
          <div className={Styles.total_amount_container}>
            <p>Total amount</p>
            <ProductPrice
              price={price * counter!}
              symbol={symbol}
            />
            {/* <BecknProductPrice price={parseFloat(product.price.value) * counter!} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
