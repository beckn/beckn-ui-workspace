import React from 'react'
import cl from 'classnames'
import { Box, calc, Flex, Image } from '@chakra-ui/react'
import { CartPageTestIds } from '@shared/dataTestIds'

// Custom
import { CartProps } from './cart.types'
import CartList from './cart-list'
import Styles from './cart.module.css'
import { Loader, Typography } from '@beckn-ui/molecules'
import OrderSummaryBox from './order-summary-box'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const Cart: React.FC<CartProps> = ({
  schema: { loader, cartItems, orderSummary, emptyCard }, // Destructure props
  isLoading = false,
  emptyText = 'Empty cart',
  className
}) => {
  if (isLoading) {
    return (
      <Box
        display="flex"
        height="calc(100vh - 160px)"
        justifyContent="center"
        alignItems={'center'}
      >
        <Loader {...loader} />
      </Box>
    )
  }

  const displayEmptyText = cartItems.length === 0 && !emptyCard

  return (
    <Box className={cl(`${className}`, Styles.cart_list_comp_container)}>
      {displayEmptyText ? (
        <Flex
          flexDir={'column'}
          columnGap={'10px'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={'100px'}
          data-test="empty-text"
        >
          <Typography
            variant="titleSemibold"
            text={emptyText}
          />
        </Flex>
      ) : (
        <>
          {cartItems.length === 0 && emptyCard && (
            <Flex
              flexDir={'column'}
              columnGap={'10px'}
              justifyContent={'center'}
              mt={'100px'}
              data-test="empty-card"
            >
              <Flex
                justifyContent={'center'}
                alignItems={'center'}
                mb={'30px'}
              >
                <Image
                  src={emptyCard.image}
                  alt="empty-card"
                  data-test={CartPageTestIds.cartEmptyImage}
                />
              </Flex>
              <Box
                textAlign={'center'}
                mb={'20px'}
              >
                <Typography
                  variant="titleSemibold"
                  dataTest={CartPageTestIds.cartEmptyheading}
                  text={emptyCard.heading!}
                />
                <Typography
                  variant="subTitleRegular"
                  dataTest={CartPageTestIds.cartEmptySubHeading}
                  text={emptyCard.subHeading!}
                />
              </Box>
              <BecknButton
                dataTest={CartPageTestIds.cartEmptyButton}
                children={emptyCard.buttonText}
                handleClick={emptyCard.buttonHanler}
              />
            </Flex>
          )}
          {cartItems.length > 0 && <CartList cartItems={cartItems} />} {/* If cart is not empty, render cart items */}
          {cartItems.length > 0 && <OrderSummaryBox {...orderSummary} />}{' '}
        </>
      )}
    </Box>
  )
}

export default Cart
