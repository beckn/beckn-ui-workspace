import React from 'react'
import ProductPrice from '../product-price'
import { OrderSummaryProps } from './cart.types'
import styles from './order-summary.module.css'
import { Button, Typography } from '@beckn-ui/molecules'

const OrderSummaryBox: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalQuantity,
  pageCTA,
  orderSummeryText,
  totalQuantityText,
  totalAmountText
}) => {
  return (
    <>
      <div className={styles.orderSummaryContainer}>
        <Typography
          variant="titleRegular"
          text={orderSummeryText}
        />
        <div className={styles.orderSummaryDetails}>
          <div className={styles.orderSummaryDetailRow}>
            <Typography
              variant="subTitleRegular"
              text={totalQuantityText}
            />
            <Typography {...totalQuantity} />
          </div>
          <div className={`${styles.orderSummaryDetailRow} ${styles.orderSummaryFlexGrow}`}>
            <Typography
              variant="subTitleRegular"
              text={totalAmountText}
            />
            <ProductPrice {...totalAmount} />
          </div>
        </div>
        <Button {...pageCTA} />
      </div>
    </>
  )
}

export default OrderSummaryBox
