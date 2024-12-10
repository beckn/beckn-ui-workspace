import { useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'

import { Box } from '@chakra-ui/react'

import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common/lib/types'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import Cart from '@components/cart'
import { CartItemProps } from '@components/cart/cart.types'
import { feedbackActions } from '@beckn-ui/common'
import { getSelectPayload } from '../utils/payload'

const RequestOverview = () => {
  const [fetchQuotes, { isLoading, data, isError }] = useSelectMutation()
  const dispatch = useDispatch()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const { transactionId, selectedProduct } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    if (items.length > 0) {
      try {
        fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
      } catch (error) {
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
          })
        )
        router.back()
      }
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
                shortDesc: singleItem.name,
                sourceText: singleItem.long_desc,
                providerName: singleItem.providerName
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
            text: 'Proceed',
            dataTest: testIds.Proceed,
            handleOnClick: () => {
              router.push('/checkout')
            }
          }
        }}
      />
    </Box>
  )
}

export default RequestOverview
