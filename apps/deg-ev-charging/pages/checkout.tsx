import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BecknAuth, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { InputProps } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import {
  CheckoutBeckn20RootState,
  checkoutBeckn20Actions,
  DiscoverRootState,
  ICartRootState,
  CartItemForRequest,
  Item,
  ParsedItemModel
} from '@beckn-ui/common'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'
import type { BecknContext } from '@beckn-ui/common/lib/types/beckn-2.0/context.types'
import { useDispatch, useSelector } from 'react-redux'
import { getCountryCode } from '@utils/general'
import { useInitMutation } from '@beckn-ui/common/src/services/beckn-2.0/init'
import { AuthRootState } from '@store/auth-slice'
import { currencyMap } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/beckn-2.0/select'
import { useLanguage } from '@hooks/useLanguage'
import { ChargerSelectRootState } from '@store/chargerSelect-slice'
import { useRouter } from 'next/router'
import { cartActions } from '@store/cart-slice'
import { getPaymentBreakDown } from '@utils/checkout-utils'
import {
  EV_CHARGING_DOMAIN,
  buildSelectRequest20,
  buildInitRequest20,
  normalizeInitResponse20ToLegacy
} from '@lib/beckn-2.0'
import type { SelectResponse } from '@beckn-ui/common/lib/types/beckn-2.0/select'
import type { InitResponseModel, SelectResponseModel } from '@beckn-ui/common'

interface FormData {
  amountToPay: string
  kwhToCharge: string
}

interface FormErrors {
  amountToPay: string
  kwhToCharge: string
}

const validateForm = (formData: FormData) => {
  const errors: FormErrors = { amountToPay: '', kwhToCharge: '' }
  const numberRegex = /^\d*\.?\d*$/

  if (!formData.kwhToCharge) {
    errors.kwhToCharge = 'Quantity (kWh) is required'
  } else if (!numberRegex.test(formData.kwhToCharge.toString())) {
    errors.kwhToCharge = 'Please enter a valid number'
  } else if (Number(formData.kwhToCharge) <= 0) {
    errors.kwhToCharge = 'Quantity must be greater than 0'
  }

  return errors
}

const ChargerDetails = () => {
  const domain = EV_CHARGING_DOMAIN

  const [formData, setFormData] = useState<FormData>({ amountToPay: '', kwhToCharge: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ amountToPay: '', kwhToCharge: '' })
  const [showPayment, setShowPayment] = useState(false)
  const [chargerDetails, setChargerDetails] = useState({
    stationId: '',
    stationName: '',
    chargerId: '',
    chargerName: '',
    portType: '',
    rate: 0,
    power: '',
    portId: ''
  })
  const [isLoading, setIsLoading] = useState<{
    select: boolean
    updateCart: boolean
    initialize: boolean
  }>({
    select: false,
    updateCart: false,
    initialize: false
  })

  const initResponseRaw = useSelector((state: CheckoutBeckn20RootState) => state.checkoutBeckn20?.initResponseRaw) ?? []
  const selectResponse = useSelector((state: CheckoutBeckn20RootState) => state.checkoutBeckn20?.selectResponse) ?? []
  const initResponseLegacy = useMemo(
    () =>
      initResponseRaw?.length && initResponseRaw[0]
        ? [
            normalizeInitResponse20ToLegacy(
              initResponseRaw[0] as { context: BecknContext; message: { order: Record<string, unknown> } }
            ) as InitResponseModel
          ]
        : [],
    [initResponseRaw]
  )
  const { items } = useSelector((state: ICartRootState) => state.cart)
  const { selectedCharger } = useSelector((state: ChargerSelectRootState) => state?.selectCharger)
  const { transactionId, lastResponseContext: discoverContext } = useSelector(
    (state: DiscoverRootState) => state.discover
  )
  const discoverCatalogs = useSelector(
    (state: DiscoverRootState) => state.discover?.catalogs ?? []
  ) as DiscoverCatalogStored[]
  const [fetchQuotes, { error: selectError }] = useSelectMutation()
  const [initialize, { error: initializeError }] = useInitMutation()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  useEffect(() => {
    if (items && items.length > 0) {
      const firstItem = items[0] as CartItemForRequest
      const initialAmount = parseFloat(selectedCharger?.rate?.toString() || '0') || 0
      const initialQtyNum = parseFloat(firstItem.quantity.toString()) || 0

      setChargerDetails({
        stationName: firstItem.providerName || '',
        stationId: firstItem.providerId || '',
        chargerName: selectedCharger?.name || '',
        chargerId: selectedCharger?.id || '',
        portType: selectedCharger?.selectedPort?.type || '',
        rate: initialAmount,
        power: firstItem.shortDesc || '',
        portId: selectedCharger?.selectedPort?.type || ''
      })

      const initialAmt = Number((initialQtyNum * initialAmount).toFixed(2))
      setFormData({
        amountToPay: initialAmt.toString(),
        kwhToCharge: initialQtyNum.toString()
      })
    }
  }, [items, selectedCharger])

  useEffect(() => {
    console.log('Dank user', user)

    let formData = {
      name: '',
      mobileNumber: '',
      email: '',
      address: '5890 W Vernor Hwy, Detroit, Michigan',
      pinCode: '48209'
    }

    if (user?.agent) {
      // If user.agent exists, use its data
      formData = {
        ...formData,
        name: user.agent.first_name.trim(),
        mobileNumber: `${user.agent.agent_profile.phone_number}`,
        email: user.email || '',
        address: '5890 W Vernor Hwy, Detroit, Michigan',
        pinCode: '48209'
      }
    } else {
      // If no user.agent, use default data
      formData = {
        ...formData,
        name: 'Lisa',
        mobileNumber: '9811259151',
        email: 'lisa.k@gmail.com',
        address: '5890 W Vernor Hwy, Detroit, Michigan',
        pinCode: '48209'
      }
    }

    console.log('Dank formData', formData)
    setShippingFormData(formData)
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = value
    if (name !== 'kwhToCharge' || Number(numericValue) < 0) return

    const calculatedAmount = Number((parseFloat(numericValue) * chargerDetails.rate).toFixed(2))
    const updatedFormData = {
      ...formData,
      kwhToCharge: numericValue,
      amountToPay: calculatedAmount.toString()
    }
    setFormData(updatedFormData)
    const errors = validateForm(updatedFormData)
    setFormErrors(prev => ({ ...prev, kwhToCharge: errors.kwhToCharge || '' }))
  }

  const getInputs = () => {
    const inputs: InputProps[] = [
      {
        type: 'number',
        name: 'kwhToCharge',
        variant: 'rounded',
        className: 'kwh-to-charge-input',
        value: formData.kwhToCharge.toString(),
        handleChange: handleInputChange,
        label: 'Quantity (kWh)',
        error: formErrors.kwhToCharge,
        dataTest: '',
        disabled: initResponseRaw.length > 0,
        step: '0.01'
      }
    ]
    return inputs
  }

  const calculatedAmount = Number((parseFloat(formData.kwhToCharge || '0') * chargerDetails.rate).toFixed(2))
  const currencySymbol = currencyMap[getCountryCode().country.code as keyof typeof currencyMap] || '₹'

  const handleInitCall = useCallback(
    async (selectRespFromApi?: SelectResponse) => {
      const selectResp = selectRespFromApi ?? (selectResponse[0] as SelectResponse)
      if (!selectResp?.context || !selectResp?.message?.order) return
      const initPayload = buildInitRequest20(selectResp, {
        shippingFormData,
        quantity: formData.kwhToCharge
      })
      try {
        const initResp = await initialize(initPayload).unwrap()
        dispatch(checkoutBeckn20Actions.setInitResponseRaw({ data: [initResp] }))
        setShowPayment(true)
      } finally {
        setIsLoading(prev => ({ ...prev, updateCart: false }))
      }
    },
    [shippingFormData, formData.kwhToCharge, selectResponse, dispatch, initialize]
  )

  const handleInitialize = useCallback(async () => {
    if (!items?.length) return
    setIsLoading(prev => ({ ...prev, updateCart: true }))

    dispatch(
      cartActions.addItemToCart({
        product: {
          ...selectedCharger?.data?.providerDetails,
          item: selectedCharger?.data?.itemDetails as Item
        } as ParsedItemModel,
        amountToPay: parseFloat(formData.amountToPay),
        quantity: parseFloat(formData.kwhToCharge)
      })
    )

    const updatedQuantity = formData.kwhToCharge
    const updatedItems = items.map((item: CartItemForRequest) => ({
      ...item,
      quantity: parseFloat(updatedQuantity) || item.quantity
    })) as CartItemForRequest[]

    try {
      const rawId = user?.agent?.id ?? user?.id
      const buyer = {
        id: rawId != null ? String(rawId) : undefined,
        displayName: shippingFormData.name || undefined,
        telephone: shippingFormData.mobileNumber || undefined,
        email: shippingFormData.email || undefined
      }
      const selectPayload = buildSelectRequest20(
        updatedItems,
        transactionId,
        selectedCharger ?? undefined,
        discoverCatalogs?.[0],
        domain,
        buyer.displayName || buyer.telephone || buyer.email ? buyer : undefined,
        discoverContext ?? undefined
      )
      const rawSelectResp = (await fetchQuotes(selectPayload).unwrap()) as SelectResponse | { data: SelectResponse }
      // Support both raw Beckn shape and gateway-wrapped { data: { context, message } }
      const selectResp: SelectResponse =
        rawSelectResp && 'data' in rawSelectResp && rawSelectResp.data?.context && rawSelectResp.data?.message
          ? (rawSelectResp.data as SelectResponse)
          : (rawSelectResp as SelectResponse)
      dispatch(checkoutBeckn20Actions.setSelectResponse({ data: [selectResp as unknown as SelectResponseModel] }))
      // Call init only after select returns 200 and we have the response
      if (selectResp?.context && selectResp?.message?.order) {
        await handleInitCall(selectResp)
      }
    } catch (err) {
      console.error('Select or init failed:', err)
    } finally {
      setIsLoading(prev => ({ ...prev, updateCart: false }))
    }
  }, [
    formData,
    selectedCharger,
    dispatch,
    items,
    transactionId,
    discoverCatalogs,
    discoverContext,
    domain,
    fetchQuotes,
    handleInitCall,
    shippingFormData,
    user
  ])

  const isFormFilled = useMemo(() => {
    const qty = parseFloat(formData.kwhToCharge || '0')
    return qty > 0 && !formErrors.kwhToCharge
  }, [formData.kwhToCharge, formErrors.kwhToCharge])

  if (selectError || initializeError) {
    return (
      <div className="grid h-[calc(100vh-300px)] content-center justify-center px-4 py-6">
        <p className="text-base text-center text-[var(--ev-text)]">{t.errorText}</p>
      </div>
    )
  }

  const cardClassName =
    'bg-[var(--ev-surface)] border border-[var(--ev-border)] overflow-hidden p-2.5 transition-shadow duration-200'
  const cardStyle = { borderRadius: 'var(--ev-radius-xl)', boxShadow: 'var(--ev-shadow-md)' }
  const cardHeaderClass = 'px-5 pt-4 pb-2'
  const cardBodyClass = 'px-5 pt-3 pb-5'

  return (
    <div
      className="hideScroll ev-app checkout-page max-w-md mx-auto px-4 sm:px-6 py-5 sm:py-6 overflow-y-auto min-h-[calc(100vh-var(--ev-header-h)-20px)] bg-[var(--ev-bg)] p-5"
      style={{ paddingBottom: 'calc(1.25rem + var(--ev-safe-bottom, 0px))' }}
    >
      <div className="flex flex-col gap-6">
        {/* Provider Details */}
        <div
          className={cardClassName}
          style={cardStyle}
        >
          <div className={cardHeaderClass}>
            <p className="text-xs font-semibold text-[var(--ev-primary)] tracking-wider uppercase">Provider Details</p>
          </div>
          <div className={cardBodyClass}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-[var(--ev-text-muted)]">Provider / Station</p>
                <p className="text-sm font-medium text-[var(--ev-text)]">{chargerDetails.stationName}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-[var(--ev-text-muted)]">Address</p>
                <p className="text-sm font-medium text-[var(--ev-text)] leading-tight break-words">
                  {selectedCharger?.address || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charger Details */}
        <div
          className={cardClassName}
          style={cardStyle}
        >
          <div className={cardHeaderClass}>
            <p className="text-xs font-semibold text-[var(--ev-primary)] tracking-wider uppercase">Charger Details</p>
          </div>
          <div className={cardBodyClass}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-[var(--ev-text-muted)]">Station Name</p>
                <p className="text-sm font-medium text-[var(--ev-text)]">{chargerDetails.stationName}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-[var(--ev-text-muted)]">Charger Name</p>
                <p className="text-sm font-medium text-[var(--ev-text)]">{chargerDetails.chargerName}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-[var(--ev-text-muted)]">Rate</p>
                <p className="text-sm font-semibold text-[var(--ev-primary)]">
                  {currencySymbol} {chargerDetails.rate} / kWh
                </p>
              </div>
              <div className="flex gap-3 mt-2 flex-wrap">
                <div
                  className="flex-1 min-w-[120px] p-4 bg-[var(--ev-bg-card)] border border-[var(--ev-border)]"
                  style={{ borderRadius: 'var(--ev-radius-md)' }}
                >
                  <p className="text-xs text-[var(--ev-text-muted)] mb-1">Charger ID</p>
                  <p
                    className="text-sm font-semibold text-[var(--ev-text)] truncate"
                    title={chargerDetails.chargerId}
                  >
                    {chargerDetails.chargerId}
                  </p>
                </div>
                <div
                  className="flex-1 min-w-[80px] p-4 bg-[var(--ev-bg-card)] border border-[var(--ev-border)]"
                  style={{ borderRadius: 'var(--ev-radius-md)' }}
                >
                  <p className="text-xs text-[var(--ev-text-muted)] mb-1">Port Type</p>
                  <p className="text-sm font-semibold text-[var(--ev-text)]">{chargerDetails.portType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Tariff */}
        <div
          className={cardClassName}
          style={cardStyle}
        >
          <div className={cardHeaderClass}>
            <p className="text-xs font-semibold text-[var(--ev-primary)] tracking-wider uppercase">Connector Tariff</p>
          </div>
          <div className={cardBodyClass}>
            <div className="book_charger_form">
              <BecknAuth
                schema={{
                  buttons: [
                    {
                      text: 'Confirm',
                      handleClick: handleInitialize,
                      variant: 'solid',
                      colorScheme: 'primary',
                      isLoading: isLoading.updateCart,
                      disabled: !isFormFilled || initResponseRaw.length > 0
                    }
                  ],
                  inputs: getInputs()
                }}
                isLoading={false}
              />
              {/* <Box
                mt={4}
                p={4}
                bg="var(--ev-primary-light)"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="var(--ev-primary)"
              >
                <Flex
                  justify="space-between"
                  align="flex-start"
                  gap={3}
                  flexWrap="wrap"
                > */}
              {/* <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="500"
                      color="var(--ev-text-muted)"
                      mb={0.5}
                    >
                      Amount
                    </Text>
                    <Text
                      fontSize="xs"
                      color="var(--ev-text-muted)"
                    >
                      (Quantity × Rate: {formData.kwhToCharge || '0'} kWh × {chargerDetails.rate} / kWh)
                    </Text>
                  </Box> */}
              {/* <Text
                    fontSize="xl"
                    fontWeight="700"
                    color="var(--ev-primary)"
                  >
                    {currencySymbol} {calculatedAmount.toFixed(2)}
                  </Text> */}
              {/* </Flex>
              </Box> */}
            </div>
          </div>
        </div>

        {/* Payment - only after confirm */}
        {showPayment && initResponseRaw.length > 0 && (
          <>
            <div
              className={cardClassName}
              style={cardStyle}
            >
              <div className={cardHeaderClass}>
                <p className="text-xs font-semibold text-[var(--ev-primary)] tracking-wider uppercase">Payment</p>
              </div>
              <div className={cardBodyClass}>
                <div className="flex flex-col gap-3">
                  {Object.entries(
                    getPaymentBreakDown(initResponseLegacy, parseFloat(formData.kwhToCharge)).breakUpMap
                  ).map(([label, amount]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <p className="text-sm font-medium text-[var(--ev-text)]">{label}</p>
                      <p className="text-sm font-medium text-[var(--ev-text-muted)]">
                        {currencySymbol}
                        {amount.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="bg-[var(--ev-surface)] border-2 border-[var(--ev-primary)] p-2.5 transition-shadow duration-200"
              style={{ borderRadius: 'var(--ev-radius-xl)', boxShadow: 'var(--ev-shadow-md)' }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-10 justify-between p-2.5">
                  <p className="text-xs font-medium text-[var(--ev-text-muted)]">Total Amount</p>
                  <p className="text-2xl font-bold text-[var(--ev-primary)]">
                    {currencySymbol}
                    {
                      getPaymentBreakDown(initResponseLegacy, parseFloat(formData.kwhToCharge)).totalPricewithCurrent
                        .value
                    }
                  </p>
                </div>
                <BecknButton
                  text="Proceed to pay"
                  sx={{ marginBottom: 0, width: '100%' }}
                  handleClick={() => router.push('/paymentMode')}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChargerDetails
