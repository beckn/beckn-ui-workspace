import { useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'

import { Box, useToast } from '@chakra-ui/react'

import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common/lib/types'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import Cart from '@components/cart'
import { CartItemProps } from '@components/cart/cart.types'
import { cartActions, CheckoutRootState } from '@beckn-ui/common'
import { getInitPayload, getSelectPayload } from '../utils/payload'
import { useInitMutation } from '@beckn-ui/common/src/services/init'

const RequestOverview = () => {
  const [fetchQuotes, { isLoading: selectIsLoading, data, isError }] = useSelectMutation()
  const dispatch = useDispatch()
  const [initialize, { isLoading: initIsLocading }] = useInitMutation()
  const toast = useToast()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const totalAmount = useSelector((state: ICartRootState) => state.cart.totalAmount)
  const { transactionId, selectedProduct } = useSelector((state: DiscoveryRootState) => state.discovery)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)

  const performInit = async () => {
    if (selectResponse && selectResponse.length > 0) {
      const shippingFormData = {
        name: 'Anand',
        mobileNumber: '9886098860',
        email: 'anand@gmail.com',
        address: 'Flat 208, A Block, Janakpuri West, New Delhi',
        pinCode: '110018',
        meterNumber: 'MT451667'
      }
      getInitPayload(shippingFormData, {}, items, transactionId, DOMAIN).then(res => {
        return initialize(res)
      })
    }
  }

  useEffect(() => {
    if (items.length > 0) {
      Promise.all([fetchQuotes(getSelectPayload(items, transactionId, DOMAIN)), performInit()])
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
        isLoading={selectIsLoading || initIsLocading}
        schema={{
          cartItems: items.map(
            singleItem =>
              ({
                id: singleItem.id,
                shortDesc: singleItem.short_desc,
                sourceText: singleItem.long_desc,
                providerName: selectedProduct.providerName
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
            }
          }
        }}
      />
    </Box>
  )
}

export default RequestOverview
