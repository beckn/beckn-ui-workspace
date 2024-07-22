import { Image } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi'
import ProductPrice from '../product-price'

// Custom modules
import Styles from './cart-item.module.css'
import { CartItemProps } from './cart.types'
import { AuthPageTestIds } from '@shared/dataTestIds'

const CartItem: React.FC<CartItemProps> = ({
  id,
  quantity = 0,
  name,
  image,
  price,
  symbol,
  handleDecrement,
  handleIncrement,
  className,
  totalAmountText
}) => {
  const [counter, setCounter] = useState(quantity)

  function increment() {
    setCounter(prev => ++prev!)
    handleIncrement(id)
  }

  function decrement() {
    setCounter(prev => --prev!)
    handleDecrement(id)
  }

  function onInputNumberChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
      setCounter(+e.currentTarget.value)
    }
  }

  return (
    <div
      className={className}
      data-test="cart-list"
    >
      <div className={Styles.cart_item_layout_container}>
        <div className={Styles.prouct_details_container}>
          <a className={Styles.product_details}>
            <div className={Styles.product_image_container}>
              <Image
                src={image}
                alt={name}
                className="object-contain"
                data-test={AuthPageTestIds.cartListImage}
              />
            </div>
            <div
              className={Styles.product_name}
              data-test={AuthPageTestIds.cartListName}
            >
              {name}
            </div>
          </a>
        </div>
        <div className={Styles.product_count_price_container}>
          <div className={Styles.product_counter_layout_container}>
            <div className={Styles.product_counter_container}>
              <div
                className={Styles.plus_icon_container}
                data-testid="test-increment"
                data-test={AuthPageTestIds.cartIncrementButton}
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
                disabled
                data-test={AuthPageTestIds.cartInput}
              />
              {counter === 1 ? (
                <div
                  className={Styles.delete_icon_container}
                  data-testid="test-delete"
                  data-test={AuthPageTestIds.cartTrashButton}
                  onClick={() => decrement()}
                >
                  <HiOutlineTrash className={Styles.delete_icon} />
                </div>
              ) : (
                <div
                  onClick={() => decrement()}
                  data-testid="test-decrement"
                  className={Styles.minus_icon_container}
                  data-test={AuthPageTestIds.cartDecrementButton}
                >
                  <HiMinusSm className={Styles.minus_icon} />
                </div>
              )}
            </div>
          </div>
          <div
            className={Styles.total_amount_container}
            data-Test={AuthPageTestIds.productPrice}
          >
            <p>{totalAmountText}</p>
            <ProductPrice
              price={price * counter}
              currencyType={symbol}
            />
            {/* <BecknProductPrice price={parseFloat(product.price.value) * counter!} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
