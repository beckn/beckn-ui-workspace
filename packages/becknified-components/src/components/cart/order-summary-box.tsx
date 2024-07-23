import React from 'react'
import ProductPrice from '../product-price'
import { OrderSummaryProps } from './cart.types'
import styles from './order-summary.module.css'
import { Button, Typography } from '@beckn-ui/molecules'
import { CartPageTestIds } from '@shared/dataTestIds'

const OrderSummaryBox: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalQuantity,
  pageCTA,
  orderSummaryText = 'Order Summary',
  totalQuantityText = 'Total Quantity',
  totalAmountText = 'Total Amount'
}) => {
  return (
    <>
      <div className={styles.orderSummaryContainer}>
        <Typography
          variant="titleRegular"
          text={orderSummaryText}
          dataTest={CartPageTestIds.orderSummaryText}
        />
        <div className={styles.orderSummaryDetails}>
          <div className={styles.orderSummaryDetailRow}>
            <Typography
              variant="subTitleRegular"
              text={totalQuantityText}
              dataTest={CartPageTestIds.totalQuantityText}
            />
            <Typography {...totalQuantity} />
          </div>
          <div className={`${styles.orderSummaryDetailRow} ${styles.orderSummaryFlexGrow}`}>
            <Typography
              variant="subTitleRegular"
              text={totalAmountText}
              dataTest={CartPageTestIds.totalAmountText}
            />
            <ProductPrice {...totalAmount} />
          </div>
        </div>
        <Button
          {...pageCTA}
          dataTest={CartPageTestIds.cartOrderButton}
        />
      </div>
    </>
  )
}

export default OrderSummaryBox
