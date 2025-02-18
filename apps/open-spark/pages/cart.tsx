import { Router, useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'

import { Box, useToast, Image, Flex, Divider } from '@chakra-ui/react'

import { CartItemProps } from '@beckn-ui/becknified-components/src/components/cart/cart.types'
import { getSelectPayload } from '@beckn-ui/common/src/utils'
import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import { Type } from 'react-toastify/dist/utils'
import { Loader, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import EmptyCart from '@components/emptyCart/emptyCart'

const Cart = () => {
  const [fetchQuotes, { isLoading, data, isError }] = useSelectMutation()
  const dispatch = useDispatch()
  const toast = useToast()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)

  const totalAmount = useSelector((state: ICartRootState) => state.cart.totalAmount)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    if (items.length > 0) {
      fetchQuotes(getSelectPayload(items, transactionId, 'deg:retail'))
    }
  }, [totalQuantity])

  const onOrderClick = () => {
    router.push('/checkout')
  }
  // const handleDeleteCartData = () => {
  //   if (selectedItem) {
  //     dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
  //   }
  // }
  const handleShopButton = () => {
    router.push('/myStore')
  }

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader text={t.quoteRequestLoader} />
      </Box>
    )
  }

  return (
    <Box
      pt={['20px', '20px', '0px', '0px']}
      className="hideScroll cart-text"
      maxH="calc(100vh - 120px)"
      overflowY={'scroll'}
    >
      <BecknCart
        isLoading={isLoading}
        schema={{
          cartItems: items.map(
            singleItem =>
              ({
                id: singleItem.id,
                className: 'myStore-cart',
                alignment: 'row',
                quantity: singleItem.quantity,
                name: singleItem.name,
                providerName: singleItem.providerName,
                image: singleItem.images?.[0].url,
                price: Number(singleItem.price.value),
                symbol: singleItem.price.currency,
                totalAmountText: t.totalAmount,
                handleIncrement: id => {
                  const selectedItem = productList.find(singleItem => singleItem.item.id === id)
                  if (selectedItem) {
                    dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
                  }
                },
                handleDecrement: id => {
                  dispatch(cartActions.removeItemFromCart(id))
                }
              }) as CartItemProps
          ),

          loader: { text: t.quoteRequestLoader, dataTest: testIds.loadingIndicator },
          orderSummary: {
            totalAmount: {
              price: totalAmount,
              currencyType: items[0]?.price.currency
            },

            totalQuantity: {
              text: totalQuantity.toString(),
              variant: 'subTitleSemibold'
            },
            pageCTA: {
              text: 'Proceed',
              handleClick: onOrderClick
            },
            orderSummaryText: t.orderSummary,
            totalQuantityText: t.totalQuantity,
            totalAmountText: 'Subtotal',
            dataTestTotalQuantity: testIds.cartpage_totalQuantityText,
            dataTestTotalAmount: testIds.cartpage_totalAmountText,
            dataTestCta: testIds.cartpage_cartOrderButton
          },
          emptyCard: {
            image: '/images/emptyCard.svg',
            heading: t.emptyCardHeading,
            subHeading: t.emptyCardSubHeading,
            buttonText: 'Shop',
            buttonHanler: handleShopButton,
            dataTestImage: testIds.cartpage_emptyImage,
            dataTestHeading: testIds.cartpage_emptyheading,
            dataTestSubHeading: testIds.cartpage_emptySubHeading,
            dataTestCta: testIds.cartpage_emptyButton
          }
        }}
      />
      {/* {!items.length ? (
        <EmptyCart />
      ) : (
        <>
          {items.map(singleItem => (
            <>
              <Flex
                alignItems={'center'}
                flexDirection="column"
                mb="40px"
                position={'relative'}
              >
                <Box
                  w="110px"
                  h={'110px'}
                  margin={'0 auto'}
                  mb="7px"
                >
                  <Image
                    src={singleItem.images?.[0]?.url}
                    alt="product-img"
                  />
                </Box>
                <Typography
                  text={singleItem.name}
                  fontSize="17px"
                  fontWeight="500"
                />
                <Flex
                  mt="7px"
                  alignItems={'center'}
                >
                  <Typography
                    fontSize="15px"
                    text={'Price:'}
                    style={{ paddingRight: '5px' }}
                  />
                  <Flex>
                    <Typography
                      fontWeight="500"
                      fontSize="15px"
                      text={singleItem.price.currency}
                      style={{ paddingRight: '5px' }}
                    />
                    <Typography
                      fontWeight="500"
                      fontSize="15px"
                      text={Number(singleItem.price.value)}
                    />
                  </Flex>
                </Flex>
                <Image
                  position={'absolute'}
                  cursor="pointer"
                  right="0"
                  top={'0'}
                  src="./images/delete.svg"
                  alt="delete img"
                  onClick={() => {
                    dispatch(cartActions.removeItemFromCart(singleItem.id))
                  }}
                />
              </Flex>

              <Typography
                text="Order summary"
                fontSize="17px"
                fontWeight="500"
                style={{ marginBottom: '15px' }}
              />
              <Box
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                p="20px"
              >
                <Flex
                  mb="15px"
                  justifyContent={'space-between'}
                  alignItems="center"
                >
                  <Typography
                    text="Total Quantity"
                    fontSize="15px"
                  />
                  <Typography
                    text={totalQuantity.toString()}
                    fontSize="15px"
                  />
                </Flex>
                <Flex
                  mb="15px"
                  justifyContent={'space-between'}
                  alignItems="center"
                >
                  <Typography
                    text="Subtotal"
                    fontSize="15px"
                  />
                  <Typography
                    text={totalAmount}
                    fontSize="15px"
                  />
                </Flex>
                <Divider mb="10px" />
                <Flex
                  justifyContent={'space-between'}
                  alignItems="center"
                >
                  <Typography
                    fontWeight="500"
                    fontSize="15px !important"
                    text="Total"
                  />
                  <Typography
                    fontWeight="500"
                    fontSize="15px !important"
                    text={totalAmount}
                  />
                </Flex>
              </Box>
              <Box
                position={'absolute'}
                bottom="calc(0px + 10px)"
                w={'calc(100% - 40px)'}
              >
                <BecknButton
                  text="Proceed"
                  handleClick={onOrderClick}
                />
              </Box>
            </>
          ))}
        </>
      )} */}
    </Box>
  )
}

export default Cart
