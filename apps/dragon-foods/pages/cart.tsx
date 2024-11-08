import { useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'

import { Box, useToast } from '@chakra-ui/react'

import { getSelectPayload } from '@beckn-ui/common/src/utils'
import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common/lib/types'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import Cart from '@components/cart'
import { CartItemProps } from '@components/cart/cart.types'
import { cartActions } from '@beckn-ui/common'

const RequestOverview = () => {
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
      fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
    }
  }, [totalQuantity])

  const handleShopButton = () => {
    router.push('/')
  }

  return (
    <Box
      pt={['20px', '20px', '0px', '0px']}
      className="hideScroll"
      maxH="calc(100vh - 120px)"
      overflowY={'scroll'}
    >
      <Cart
        isLoading={isLoading}
        schema={{
          cartItems: items.map(
            singleItem =>
              ({
                id: singleItem.id,
                shortDesc: singleItem.short_desc,
                sourceText: singleItem.long_desc
              }) as CartItemProps
          ),
          loader: { text: t.quoteRequestLoader, dataTest: testIds.loadingIndicator },
          emptyCard: {
            image: '/images/emptyCard.svg',
            heading: t.emptyCardHeading,
            subHeading: t.emptyCardSubHeading,
            buttonText: t.shop,
            buttonHanler: handleShopButton,
            dataTestImage: testIds.cartpage_emptyImage,
            dataTestHeading: testIds.cartpage_emptyheading,
            dataTestSubHeading: testIds.cartpage_emptySubHeading,
            dataTestCta: testIds.cartpage_emptyButton
          },
          actionButton: {
            text: 'Send Request',
            handleOnClick: () => {
              router.push('/orderConfirmation')
              dispatch(cartActions.clearCart())
            }
          }
        }}
      />
    </Box>
  )
}

export default RequestOverview
