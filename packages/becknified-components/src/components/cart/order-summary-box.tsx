import React from 'react'
import ProductPrice from '../product-price'
import { OrderSummaryProps } from './cart.types'
import styles from './order-summary.module.css'
import { Typography } from '@beckn-ui/molecules'

const OrderSummaryBox: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalQuantity,
  orderSummaryText = 'Order Summary',
  totalQuantityText = 'Total Quantity',
  totalAmountText = 'Total Amount',
  dataTestText = 'order-summary',
  dataTestTotalQuantity = 'total-quantity-text',
  dataTestTotalAmount = 'total-amount-text'
}) => {
  return (
    <>
      <Typography
        variant="titleRegular"
        fontWeight="600"
        text={orderSummaryText}
        dataTest={dataTestText}
        className={styles.orderSummaryText}
      />
      <div className={styles.orderSummaryContainer}>
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
      </div>
      {/* <div className={styles.CTA_btn}>
        <Button
          {...pageCTA}
          dataTest={dataTestCta}
        />
      </div> */}
    </>
  )
}

export default OrderSummaryBox
