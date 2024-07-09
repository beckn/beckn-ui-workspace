import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import OrderCancellationModal from '../cancelOrderModal/cancelOrderModal'
import OrderMenuModal from '../orderMenuModal'
import AllOrderDeliveredBatch from './subComponents/allOrderDeliveredBatch'
import OrderOverView from './subComponents/orderOverView'
import OrderSummary from './subComponents/orderSummary'
import ProgressSummary from './subComponents/progressSummary'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { feedbackActions } from '../../store/ui-feedback-slice'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import {
  ConfirmResponseModel,
  DataState,
  ProcessState,
  StatusKey,
  statusMap,
  StatusResponseModel,
  UIState
} from '../../../lib/types'
import { getPayloadForOrderStatus, isEmpty } from '../../utils'
import { customerServiceMenuType, OrderMenuType } from '../types'
import { OrderDetailsProps } from './orderDetails.types'
import { statusActions } from '../../store/status-slice'
import { extractOrderDetails, getCancelPayload, getTrackSupportOrderPayload } from './utils'

const DELIVERED = 'Delivered'
const CANCELLED = 'CANCELLED'

const OrderDetailsSection = (props: OrderDetailsProps) => {
  const { allOrderDelivered, progressSummary, t, apiUrl, domain, handleUpdateOrder } = props

  const [data, setData] = useState<DataState>({
    confirmData: null,
    statusData: [],
    trackUrl: null,
    supportData: null
  })

  const [uiState, setUiState] = useState<UIState>({
    isProceedDisabled: true,
    isLoading: true,
    isLoadingForTrackAndSupport: false,
    isMenuModalOpen: false,
    isCancelMenuModalOpen: false,
    isLoadingForCancel: false
  })

  const [processState, setProcessState] = useState<ProcessState>({
    apiCalled: false,
    allOrderDelivered: false,
    radioValue: '',
    orderCancelled: false
  })

  const [orderStatusMap, setOrderStatusMap] = useState<any[]>([])
  const [currentStatusLabel, setCurrentStatusLabel] = useState('')
  const [isError, setIsError] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setData(prevState => ({
        ...prevState,
        confirmData: parsedConfirmData
      }))
    }
  }, [])

  useEffect(() => {
    const storedOrderStatusMap = JSON.parse(localStorage.getItem('orderStatusMap') || '[]')
    setOrderStatusMap(storedOrderStatusMap)
  }, [])

  useEffect(() => {
    if (orderStatusMap.length > 0) {
      localStorage.setItem('orderStatusMap', JSON.stringify(orderStatusMap))
      setCurrentStatusLabel(orderStatusMap[orderStatusMap.length - 1].label)
    }
  }, [orderStatusMap])

  useEffect(() => {
    if (data.statusData.length > 0) {
      const newData = data.statusData
        .map((status: StatusResponseModel) => {
          const { tags } = status?.message?.order
          const statusKey: string = tags?.[tags?.length - 1].list?.[0].value!
          return {
            label: statusMap[statusKey as StatusKey],
            statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at || status?.context?.timestamp
          }
        })
        .filter(status => status.label)

      const labelSet = new Set(orderStatusMap.map(status => status.label))
      setOrderStatusMap(prevState => [...prevState, ...newData.filter(status => !labelSet.has(status.label))])
    }
  }, [data.statusData])

  const fetchData = () => {
    let statusPayload: any = null
    if (localStorage.getItem('selectedOrder')) {
      const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
      const { bppId, bppUri, orderId } = selectedOrderData
      statusPayload = {
        data: [
          {
            context: {
              transaction_id: uuidv4(),
              bpp_id: bppId,
              bpp_uri: bppUri,
              domain: domain
            },
            message: {
              order_id: orderId,
              orderId: orderId
            }
          }
        ]
      }
    } else if (data.confirmData && data.confirmData.length > 0) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      statusPayload = getPayloadForOrderStatus(parsedConfirmData)
    }

    if (statusPayload) {
      setUiState(prevState => ({
        ...prevState,
        isLoading: true
      }))

      axios
        .post(`${apiUrl}/status`, statusPayload)
        .then(res => {
          if (JSON.stringify(res.data) === '{}') {
            setIsError(true)
            return
          }
          const resData = res.data.data
          setData(prevState => ({
            ...prevState,
            statusData: resData
          }))
          localStorage.setItem('statusResponse', JSON.stringify(resData))
        })
        .catch(err => {
          console.error('Error fetching order status:', err)
        })
        .finally(() => {
          setUiState(prevState => ({
            ...prevState,
            isLoading: false
          }))

          setProcessState(prevState => ({
            ...prevState,
            apiCalled: true
          }))
        })
    }
  }

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 30000)
    return () => clearInterval(intervalId)
  }, [apiUrl, data.confirmData])

  const isDelivered = data.statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === DELIVERED
  const isCancelled = data.statusData?.[0]?.message?.order?.status === CANCELLED

  useEffect(() => {
    if (isDelivered) {
      setProcessState(prevState => ({
        ...prevState,
        allOrderDelivered: true
      }))
    }
  }, [data.statusData])

  useEffect(() => {
    if (isCancelled) {
      setProcessState(prevState => ({
        ...prevState,
        orderCancelled: true
      }))
    }
  }, [data.statusData])

  const handleTrackOrder = (trackingUrl: string) => {
    if (trackingUrl) {
      window.open(trackingUrl, '_blank')
    } else {
      dispatch(
        feedbackActions.setToastData({
          toastData: { message: 'Error', display: true, type: 'error', description: t('unabletoTrack') }
        })
      )
    }
  }

  const handleCancelMenuModalOpen = () => {
    setUiState(prevState => ({
      ...prevState,
      isCancelMenuModalOpen: true,
      isMenuModalOpen: false
    }))
  }

  const onMenuItemClick = (id: string) => {
    switch (id) {
      case OrderMenuType.TRACK_ORDER:
        handleTrackOrder(data.trackUrl!)
        break
      case OrderMenuType.UPDATE_ORDER:
        handleUpdateOrder()
        break
      case OrderMenuType.CANCEL_ORDER:
        handleCancelMenuModalOpen()
        break
      default:
        break
    }
  }

  const handleEmailCustomer = (email: string) => {
    const subject = 'Regarding Your Order'
    const body = 'Dear Customer,\n\n'

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.open(mailtoLink, '_blank')
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  const handleCallCustomer = (phoneNumber: string) => {
    const telLink = `tel:${phoneNumber}`
    window.open(telLink, '_blank')
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  const onCustomerMenuItemClick = (id: string) => {
    switch (id) {
      case customerServiceMenuType.CALL_SERVICE:
        handleCallCustomer(data.supportData?.phone!)
        break
      case customerServiceMenuType.EMAIL_SERVICE:
        handleEmailCustomer(data.supportData?.email!)
        break
      default:
        break
    }
  }

  const handleMenuModalClose = () => {
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  const handleCancelMenuModalClose = () => {
    setUiState(prevState => ({
      ...prevState,
      isCancelMenuModalOpen: false
    }))
  }

  const handleRadioBtnChange = (value: string) => {
    setProcessState(prevValue => ({
      ...prevValue,
      radioValue: value
    }))
    setUiState(prevValue => ({
      ...prevValue,
      isProceedDisabled: false
    }))
  }

  if (uiState.isLoading && !processState.apiCalled) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 72px)"
        alignItems="center"
        justifyContent="center"
      >
        <LoaderWithMessage
          loadingText={t('pleaseWait')}
          loadingSubText={t('statusLoaderSubText')}
        />
      </Box>
    )
  }

  if (isError) {
    return (
      <>
        {toast.error('Something went wrong', {
          position: 'top-center'
        })}
      </>
    )
  }

  const {
    billingAddress,
    billingName,
    billingPhone,
    created_at,
    breakup,
    price,
    shippingPhone,
    shippingName,
    shipmentAddress,
    updateShippingPhone,
    updatedShippingEmail,
    updatedShippingName
  } = extractOrderDetails(data)

  const handleOpenOrderMenu = async () => {
    setUiState(prevState => ({
      ...prevState,
      isLoadingForTrackAndSupport: true,
      isMenuModalOpen: true
    }))

    try {
      let confirmData, selectedOrderData, statusResponseData

      if (data.confirmData && data.confirmData.length > 0) {
        confirmData = data.confirmData
      } else if (localStorage.getItem('selectedOrder') && localStorage.getItem('statusResponse')) {
        selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        statusResponseData = JSON.parse(localStorage.getItem('statusResponse') as string)
      }

      if (confirmData || (selectedOrderData && statusResponseData)) {
        const { trackPayload, supportPayload } = getTrackSupportOrderPayload(
          confirmData,
          selectedOrderData,
          statusResponseData
        )

        const [trackResponse, supportResponse] = await Promise.all([
          axios.post(`${apiUrl}/track`, trackPayload),
          axios.post(`${apiUrl}/support`, supportPayload)
        ])

        if (!isEmpty(trackResponse.data) && !isEmpty(supportResponse.data)) {
          setData(prevState => ({
            ...prevState,
            trackUrl: trackResponse.data.data[0].message?.tracking.url,
            supportData: {
              email: supportResponse.data.data[0].message?.support.email,
              phone: supportResponse.data.data[0].message?.support.phone
            }
          }))
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUiState(prevState => ({
        ...prevState,
        isLoadingForTrackAndSupport: false
      }))
    }
  }

  const handleCancelButton = async (
    confirmData: ConfirmResponseModel[] | null | undefined,
    statusData: StatusResponseModel[],
    cancellationReason: string
  ) => {
    setUiState(prevState => ({
      ...prevState,
      isLoadingForCancel: true
    }))

    try {
      let cancelPayload
      if (confirmData && confirmData.length > 0) {
        const { context, message } = confirmData[0]
        cancelPayload = getCancelPayload(context, message.orderId, cancellationReason)
      } else if (statusData && statusData.length > 0 && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { orderId } = selectedOrderData
        cancelPayload = getCancelPayload(statusData[0].context, orderId, cancellationReason)
      }

      if (cancelPayload) {
        const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)

        if (cancelResponse.data.data.length > 0) {
          router.push('/orderCancellation')
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUiState(prevState => ({
        ...prevState,
        isLoadingForCancel: false
      }))
    }
  }

  const handleProceedClick = () => {
    dispatch(statusActions.addStatusResponse({ statusResponse: data.statusData }))
    handleCancelButton(
      data.confirmData as ConfirmResponseModel[],
      data.statusData as StatusResponseModel[],
      processState.radioValue
    )
  }

  return (
    <>
      <Box
        className="hideScroll"
        maxH="calc(100vh - 100px)"
        overflowY="scroll"
      >
        <Box
          maxW={{ base: '100%', md: '50%' }}
          margin="0 auto"
        >
          {processState.allOrderDelivered && (
            <AllOrderDeliveredBatch
              t={t}
              handleOnRateUsClick={() => {
                dispatch(statusActions.addStatusResponse({ statusResponse: data.statusData }))
                allOrderDelivered.handleOnRateUsClick()
              }}
            />
          )}
        </Box>

        <Box
          display={{ base: 'block', lg: 'flex' }}
          justifyContent="space-between"
          marginTop="2rem"
          gap="3rem"
        >
          <Box width={{ base: '100%', lg: '80%' }}>
            <OrderOverView
              t={t}
              orderData={{
                name: data.statusData[0]?.message?.order?.items[0]?.name,
                url: data.statusData[0]?.message?.order?.items[0]?.images?.[0].url,
                createdAt: created_at
              }}
            />

            <ProgressSummary
              t={t}
              currencyMap={progressSummary.currencyMap}
              isCancelled={isCancelled}
              isDelivered={isDelivered}
              orderData={{
                name: data.statusData[0]?.message?.order?.items[0]?.name,
                status: data.statusData[0].message.order.status,
                items: data.statusData[0].message.order.items
              }}
              orderStatusMap={orderStatusMap}
              handleOpenOrderMenu={handleOpenOrderMenu}
            />
          </Box>

          {/* shipping, billing & payment details */}
          <Box
            display="flex"
            flexDir={{ base: 'column', lg: 'column' }}
            gap="1rem"
          >
            <OrderSummary
              t={t}
              orderDetails={{
                shipping: {
                  name: updatedShippingName || shippingName,
                  address: shipmentAddress,
                  phone: updateShippingPhone || shippingPhone
                },
                billing: { name: billingName, address: billingAddress, phone: billingPhone },
                statusData: data.statusData
              }}
            />

            {/* Display main bottom modal */}
            <OrderMenuModal
              t={t}
              isLoadingForTrackAndSupport={uiState.isLoadingForTrackAndSupport}
              isOpen={uiState.isMenuModalOpen}
              onClose={handleMenuModalClose}
              onCustomerMenuItemClick={onCustomerMenuItemClick}
              onMenuItemClick={onMenuItemClick}
            />

            {/* Display cancellation bottom modal */}
            <OrderCancellationModal
              t={t}
              isOpen={uiState.isCancelMenuModalOpen}
              onClose={handleCancelMenuModalClose}
              isLoadingForCancel={uiState.isLoadingForCancel}
              radioValue={processState.radioValue}
              isProceedDisabled={uiState.isProceedDisabled}
              handleOnRadioBtnChange={handleRadioBtnChange}
              handleOnProceedClick={handleProceedClick}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default OrderDetailsSection
