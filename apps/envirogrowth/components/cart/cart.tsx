import React from 'react'
import cl from 'classnames'
import { Box, Flex, Image } from '@chakra-ui/react'

// Custom
import { CartProps } from './cart.types'
import CartList from './cart-list'
import Styles from './cart.module.css'
import { Loader, Typography, Button as BecknButton, Button } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

const Cart: React.FC<CartProps> = ({
  schema: { loader, cartItems, actionButton, emptyCard }, // Destructure props
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

  return (
    <Box className={cl(`${className}`, Styles.cart_list_comp_container)}>
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
                data-test={emptyCard.dataTestImage}
              />
            </Flex>
            <Box
              textAlign={'center'}
              mb={'20px'}
            >
              <Typography
                variant="titleSemibold"
                dataTest={emptyCard.dataTestHeading}
                text={emptyCard.heading!}
              />
              <Typography
                variant="subTitleRegular"
                dataTest={emptyCard.dataTestSubHeading}
                text={emptyCard.subHeading!}
              />
            </Box>
            <BecknButton
              dataTest={emptyCard.dataTestCta}
              text={emptyCard.buttonText}
              handleClick={emptyCard.buttonHanler}
            />
          </Flex>
        )}
        {cartItems.length > 0 && (
          <>
            <Box
              textAlign={'left'}
              mb={'20px'}
              width={'100%'}
            >
              <Typography
                variant="subTitleRegular"
                text="Request Overview"
                dataTest={testIds.request_overview}
                sx={{ paddingBottom: '20px' }}
              />
              <CartList cartItems={cartItems} />
            </Box>
            <Box
              w="307px"
              mr="20px"
              alignSelf={'start'}
            >
              <Button
                text={actionButton?.text}
                handleClick={actionButton?.handleOnClick}
              />
            </Box>
          </>
        )}
      </>
    </Box>
  )
}

export default Cart
