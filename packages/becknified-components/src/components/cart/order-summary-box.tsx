import React from 'react'
import ProductPrice from '../product-price'
import { OrderSummaryProps } from './cart.types'
import styles from './order-summary.module.css'
import { Button, Typography } from '@beckn-ui/molecules'

const OrderSummaryBox: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalQuantity,
  pageCTA,
  orderSummaryText = 'Order Summary',
  totalQuantityText = 'Total Quantity',
  totalAmountText = 'Total Amount',
  dataTestText = 'order-summary',
  dataTestCta = 'cart-order-button',
  dataTestTotalQuantity = 'total-quantity-text',
  dataTestTotalAmount = 'total-amount-text'
}) => {
  return (
    <>
      <div className={styles.orderSummaryContainer}>
        <Typography
          variant="titleRegular"
          text={orderSummaryText}
          dataTest={dataTestText}
        />
        <div className={styles.orderSummaryDetails}>
          <div className={styles.orderSummaryDetailRow}>
            <Typography
              variant="subTitleRegular"
              text={totalQuantityText}
              dataTest={dataTestTotalQuantity}
            />
            <Typography {...totalQuantity} />
          </div>
          <div className={`${styles.orderSummaryDetailRow} ${styles.orderSummaryFlexGrow}`}>
            <Typography
              variant="subTitleRegular"
              text={totalAmountText}
              dataTest={dataTestTotalAmount}
            />
            <ProductPrice {...totalAmount} />
          </div>
        </div>
        <Button
          {...pageCTA}
          dataTest={dataTestCta}
        />
      </div>
    </>
  )
}

export default OrderSummaryBox
