import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelectionProps } from '@beckn-ui/common'
import { CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { useConfirmMutation } from '@beckn-ui/common/src/services/beckn-2.0/confirm'
import { checkoutActions } from '@beckn-ui/common/src/store/checkout-slice'
import { buildConfirmRequest20, normalizeConfirmResponse20ToLegacy } from '@utils/payload-2.0'
import type { InitResponse } from '@beckn-ui/common/lib/types/beckn-2.0/init'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { Box } from '@chakra-ui/react'

import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const PaymentMode = (props: PaymentMethodSelectionProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [checkedState, setCheckedState] = useState<string | null>(null)
  const [checkedPayment, setCheckedPayment] = useState<string | null>(null)

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const initResponseRaw20 = useSelector((state: CheckoutRootState) => state.checkout?.initResponseRaw20)
  const [confirm, { isLoading: isConfirmLoading }] = useConfirmMutation()

  const {
    disableButton = false,
    paymentMethods = [
      {
        category: 'Credit & Debit Cards',
        img: Visa,
        paymentMethod: t.cardNumber,
        paymentMethodNet: t.cardNumber,
        disabled: false,
        dataTest: testIds.paymentpage_visa
      },
      {
        category: 'Credit & Debit Cards',
        img: masterCard,
        paymentMethod: t.cardNumber,
        paymentMethodNet: t.cardNumber,
        disabled: false,
        dataTest: testIds.paymentpage_masterCard
      }
    ]
  } = props

  const handleChange = (id: string) => {
    setSelectedPaymentMethod(id)
    setCheckedPayment(id === checkedState ? null : id)
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <PaymentDetailsCard
        checkedState={checkedPayment!}
        handleChange={handleChange}
        paymentMethods={paymentMethods}
        t={key => t[key]}
      />
      <BecknButton
        dataTest={testIds.paymentpage_confirmButton}
        sx={{
          marginTop: '2rem'
        }}
        text={t.confirmOrder}
        handleClick={async () => {
          if (!checkedPayment || !initResponseRaw20?.length) return
          setOpenModal(true)
          try {
            const initResp = initResponseRaw20[0] as InitResponse
            const payload = buildConfirmRequest20(initResp)
            const confirmResp = await confirm(payload).unwrap()
            dispatch(
              checkoutActions.setConfirmResponse({ data: [normalizeConfirmResponse20ToLegacy(confirmResp) as any] })
            )
            router.push('/orderConfirmation')
          } catch (err) {
            setOpenModal(false)
          }
        }}
        disabled={!checkedPayment || disableButton || isConfirmLoading || !initResponseRaw20?.length}
        isLoading={isConfirmLoading}
      />
    </Box>
  )
}

export default PaymentMode
