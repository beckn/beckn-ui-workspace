import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelectionProps } from '@beckn-ui/common'
import { CheckoutBeckn20RootState, checkoutBeckn20Actions } from '@beckn-ui/common'
import { useConfirmMutation } from '@beckn-ui/common/src/services/beckn-2.0/confirm'
import { buildConfirmRequest20, normalizeConfirmResponse20ToLegacy } from '@lib/beckn-2.0'
import type { InitResponse } from '@beckn-ui/common/lib/types/beckn-2.0/init'
import type { ConfirmResponseModel } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { Box } from '@chakra-ui/react'

import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const PaymentMode = (props: PaymentMethodSelectionProps) => {
  const [, setOpenModal] = useState<boolean>(false)
  const [, setSelectedPaymentMethod] = useState<string>('')
  const [checkedPayment, setCheckedPayment] = useState<string | null>(null)

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const initResponseRaw = useSelector((state: CheckoutBeckn20RootState) => state.checkoutBeckn20?.initResponseRaw) ?? []
  const [confirm, { isLoading: isConfirmLoading }] = useConfirmMutation()

  useEffect(() => {
    if (initResponseRaw?.length === 0) {
      router.replace('/checkout')
    }
  }, [initResponseRaw?.length, router])

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
    setCheckedPayment(prev => (prev === id ? null : id))
  }

  const handlePay = async () => {
    if (!checkedPayment || !initResponseRaw?.length) return
    const initForConfirm = initResponseRaw[0] as InitResponse
    if (!initForConfirm?.context || !initForConfirm?.message?.order) return
    setOpenModal(true)
    try {
      const payload = buildConfirmRequest20(initForConfirm as InitResponse)
      const confirmResp = await confirm(payload).unwrap()
      dispatch(
        checkoutBeckn20Actions.setConfirmResponse({
          data: [normalizeConfirmResponse20ToLegacy(confirmResp) as unknown as ConfirmResponseModel]
        })
      )
      router.push('/orderConfirmation')
    } catch (err) {
      setOpenModal(false)
    }
  }

  const isPayDisabled = !checkedPayment || disableButton || isConfirmLoading

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY="scroll"
      px={4}
    >
      <PaymentDetailsCard
        checkedState={checkedPayment ?? ''}
        handleChange={handleChange}
        paymentMethods={paymentMethods}
        t={key => t[key]}
      />
      <BecknButton
        dataTest={testIds.paymentpage_confirmButton}
        type="button"
        sx={{
          marginTop: '2rem',
          cursor: isPayDisabled ? 'not-allowed' : 'pointer'
        }}
        text={t.confirmOrder}
        handleClick={handlePay}
        disabled={isPayDisabled}
        isLoading={isConfirmLoading}
      />
    </Box>
  )
}

export default PaymentMode
