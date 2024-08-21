import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import CashOnDelivery from '@public/images/cash.svg'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { testIds } from '@shared/dataTestIds'
import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { SelectRideRootState } from '@store/selectRide-slice'
import { getConfirmPayload } from '@utils/payload'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { LoaderWithMessage } from '@beckn-ui/molecules'

const PaymentMode = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useLanguage()
  const router = useRouter()

  const [confirm] = useConfirmMutation()
  const initResponse = useSelector((state: SelectRideRootState) => state.selectRide.initResponse)

  const handleSubmit = async () => {
    setIsLoading(true)
    if (initResponse?.length) {
      const payLoad = getConfirmPayload(initResponse[0])
      await confirm(payLoad)
      setIsLoading(false)
      router.push({
        pathname: '/',
        query: { fromPayment: true }
      })
    }
  }

  return (
    <Box mt="90px">
      {isLoading ? (
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
          height={'calc(100vh - 200px)'}
        >
          <LoaderWithMessage
            loadingText={t.pleaseWait}
            loadingSubText={t.confirmLoaderSubtext}
          />
        </Box>
      ) : (
        <PaymentMethodSelection
          t={key => t[key]}
          paymentMethods={[
            {
              category: 'Credit & Debit Cards',
              img: Visa,
              paymentMethod: t.cardNumber,
              paymentMethodNet: t.cardNumber,
              disabled: true,
              dataTest: testIds.paymentpage_visa
            },
            {
              category: 'Credit & Debit Cards',
              img: masterCard,
              paymentMethod: t.cardNumber,
              paymentMethodNet: t.cardNumber,
              disabled: true,
              dataTest: testIds.paymentpage_masterCard
            },
            {
              category: 'Other',
              img: CashOnDelivery,
              paymentMethod: t.cashOnDelivery,
              paymentMethodNet: t.netBanking,
              disabled: false,
              dataTest: testIds.paymentpage_CashOnDelivery
            }
          ]}
          handleOrderConfirmation={handleSubmit}
        />
      )}
    </Box>
  )
}

export default PaymentMode
