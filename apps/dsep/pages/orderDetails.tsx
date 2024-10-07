import { Box, CardBody, Divider, Flex, Text, Image, Card, useDisclosure, Stack } from '@chakra-ui/react'
import { DetailCard, ProductPrice } from '@beckn-ui/becknified-components'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Accordion, BottomModal, Typography } from '@beckn-ui/molecules'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { formatTimestamp } from '../utilities/confirm-utils'
import {
  getCancelPayload,
  getStatusPayload,
  getTrackAndSupportPayload,
  getUpdatePayload,
  handleCallCustomer,
  handleEmailCustomer,
  orderCancelReason
} from '../utilities/orderDetails-utils'
import { getPaymentBreakDown } from '../utilities/checkout-utils'
import TrackIcon from '../public/images/TrackIcon.svg'
import useRequest from '../hooks/useRequest'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ConfirmResponseModel } from '../lib/types/confirm.types'
import { StatusData, StatusResponseModel } from '../lib/types/status.types'
import { SupportResponseModel } from '../lib/types/support.types'
import { TrackingResponseModel } from '../lib/types/track.types'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import UpdateAddressDetailForm from '../components/orderDetails/update-address-detail-form'
import { ShippingFormData } from './checkoutPage'
import CancelOrderForm from '../components/orderDetails/cancel-order-form'
import RateUsCard from '../components/orderDetails/rate-us-card'
import OrderOverview from '../components/orderDetails/order-overview'
import { toast } from 'react-toastify'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import axios from '../services/axios'
import { feedbackActions } from '../store/ui-feedback-slice'
import { useDispatch } from 'react-redux'
import { testIds } from '@shared/dataTestIds'

// TODO :- to check this order details component

const OrderDetails = () => {
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel | null>(null)
  const [statusResponse, setStatusResponse] = useState<StatusResponseModel | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string
  const statusRequest = useRequest()
  const router = useRouter()
  const [SupportResponse, setSupportResponse] = useState<SupportResponseModel | null>(null)
  const [trackResponse, setTrackResponse] = useState<TrackingResponseModel | null>(null)
  const [isLoadingForTrackAndSupport, SetIsLoadingForTrackAndSupport] = useState(true)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [isAddressUpdateModalOpen, setIsAddressUpdateModalOpen] = useState(false)
  const [isCancelMenuModalOpen, setIsCancelMenuModalOpen] = useState(false)
  const [isProceedDisabled, setIsProceedDisabled] = useState(true)
  const [radioValue, setRadioValue] = useState('')
  const [isLoadingForCancel, setIsLoadingForCancel] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const dispatch = useDispatch()
  const { t } = useLanguage()

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmResponse: ConfirmResponseModel = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setConfirmData(parsedConfirmResponse)
    }
  }, [])

  const fetchStatusData = () => {
    if (confirmData) {
      const statusPayload = getStatusPayload(confirmData)
      statusRequest.fetchData(`${apiUrl}/status`, 'POST', statusPayload)
    }
  }

  useEffect(() => {
    fetchStatusData()
  }, [confirmData, trigger])

  useEffect(() => {
    if (statusRequest.data) {
      localStorage.setItem('statusResponse', JSON.stringify(statusRequest.data))
      setStatusResponse(statusRequest.data)
    }
  }, [statusRequest.data])

  if (statusRequest.loading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.statusLoaderSubtext}
        />
      </Box>
    )
  }

  if (isLoadingForCancel) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.requestProcessLoaderText}
        />
      </Box>
    )
  }

  if (!statusResponse) {
    return <></>
  }

  // if (statusRequest.error) {
  //   return toast.error('Something went wrong', {
  //     position: 'top-center'
  //   })
  // }

  const { data } = statusResponse
  const totalOrdersQty = data.length
  const filteredOrder = data.filter(res => {
    res.message.order.fulfillments[0].state.descriptor.short_desc === 'Delivered'
  })
  const orderSubTotal = data.reduce((acc, curr) => acc + parseFloat(curr.message.order.quote.price.value), 0)
  const {
    context,
    message: {
      order: {
        quote: {
          price: { currency }
        },
        billing: { name, phone, address }
      }
    }
  } = data[0]
  const { timestamp } = context
  const totalItemsInAnOrder = (bppStatusData: StatusData) => {
    return bppStatusData.message.order.items.length
  }

  const menuItems = (trackResponse: TrackingResponseModel) => [
    {
      image: '/images/trackOrder.svg',
      text: 'Track Order',
      onClick: () => {
        if (!trackResponse) window.open(trackResponse?.data[0].message.tracking.url, '_blank')
        else
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Error', display: true, type: 'error', description: t.unabletoTrack }
            })
          )
      }
    },

    {
      image: '/images/cancelOrder.svg',
      text: (
        <Text
          as="span"
          color="#E93324"
          fontWeight="400"
          fontSize="15px"
        >
          Cancel Order
        </Text>
      ),
      onClick: () => {
        setIsCancelMenuModalOpen(true)
      }
    }
  ]

  const callMenuItem = (SupportResponse: SupportResponseModel) => [
    {
      image: '/images/callCustomer.svg',
      text: 'Call Customer Service',
      onClick: () => handleCallCustomer(SupportResponse?.data[0].message.support.phone as string, setIsMenuModalOpen)
    },
    {
      image: '/images/emailCustomer.svg',
      text: 'Email Customer Service',
      onClick: () => handleEmailCustomer(SupportResponse?.data[0].message.support.email as string, setIsMenuModalOpen)
    }
  ]

  const handleMenuDotsClick = async (statusResponse: StatusData) => {
    try {
      setIsMenuModalOpen(true)

      const { supportPayload, trackPayload } = getTrackAndSupportPayload(statusResponse)
      const [trackResponse, supportResponse] = await Promise.all([
        axios.post(`${apiUrl}/track`, trackPayload),
        axios.post(`${apiUrl}/support`, supportPayload)
      ])
      if (trackResponse && supportResponse) {
        setSupportResponse(supportResponse.data)
        setTrackResponse(trackResponse.data)
        SetIsLoadingForTrackAndSupport(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateFormSubmit = async (formData: ShippingFormData, statusResponse: StatusResponseModel) => {
    try {
      const updatePayload = getUpdatePayload(formData, statusResponse)
      const updateResponse = await axios.post(`${apiUrl}/update`, updatePayload)

      if (updateResponse && confirmData) {
        fetchStatusData()
        setIsAddressUpdateModalOpen(false)
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Success',
              display: true,
              type: 'success',
              description: 'Your billing details have been successfully updated!'
            }
          })
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancelSubmit = async (statusResponse: StatusData, cancellationId: string) => {
    setIsLoadingForCancel(true)
    try {
      const cancelPayload = getCancelPayload(statusResponse, cancellationId)
      const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)
      if (cancelResponse) {
        setIsLoadingForCancel(false)
        router.push('/orderCancellation')
      }
    } catch (error) {
      setIsLoadingForCancel(false)
      console.error(error)
    }
  }

  const cancellationId = orderCancelReason.find(reason => reason.reason === radioValue)?.id
  const areAllCoursesCompleted = statusResponse.data.every(
    res => res.message.order.fulfillments[0].state.descriptor.short_desc === 'completed'
  )

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {areAllCoursesCompleted && (
        <RateUsCard
          header={t.courseCompleted}
          rateText={t.rateUs}
          subHeader={t.howTodo}
          handleRateClick={() => router.push('/feedback')}
        />
      )}
      <DetailCard>
        <Flex
          alignItems={'center'}
          pb={'8px'}
          data-test={testIds.job_main_container}
        >
          <Image
            src="/images/jobSearch.svg"
            alt=" "
          />

          <Typography
            style={{
              paddingLeft: '8px'
            }}
            dataTest={testIds.job_main_container_text}
            text={t.lookingtojobs}
            variant="titleSemibold"
          />
        </Flex>
        <Box pl={'28px'}>
          <Typography
            fontSize={'15px'}
            dataTest={testIds.job_main_container_job_change_text}
            text={t.jobChangeInfo}
            variant="subTextRegular"
          />
          <Link href={'/jobSearch'}>
            <Typography
              style={{
                cursor: 'pointer'
              }}
              text={t.searchForJob}
              dataTest={testIds.job_main_container_job_search_link}
              color="rgba(var(--color-primary))"
              variant="subTextRegular"
              fontSize="15px"
            />
          </Link>
        </Box>
      </DetailCard>

      <DetailCard>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          pb="10px"
        >
          <Box
            fontWeight={600}
            fontSize={'17px'}
            data-test={testIds.orderDetailspage_orderSummary}
          >
            {t.orderSummary}
          </Box>
          <Image
            cursor={'pointer'}
            onClick={() => setTrigger(trigger + 1)}
            src={'/images/refresh.svg'}
            alt="icon-to-refresh"
          />
        </Flex>
        <Flex
          pt={'unset'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            text={t.bookedIn}
            variant={'subTitleRegular'}
            dataTest={testIds.orderDetails_bookenIn_text}
          />
          <Typography
            text={formatTimestamp(timestamp)}
            variant={'subTitleRegular'}
            dataTest={testIds.orderDetails_timestamp}
          />
        </Flex>

        <Flex
          pt={4}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            text={t.ordersFulfilled}
            variant={'subTitleRegular'}
            dataTest={testIds.orderDetails_ordersFulfilled_text}
          />
          <Typography
            text={`${filteredOrder.length} of ${totalOrdersQty}`}
            variant={'subTitleRegular'}
            dataTest={testIds.orderDetails_ordersFulfilled_length}
          />
        </Flex>
      </DetailCard>

      {statusResponse?.data.map((res, index: number) => {
        return (
          <>
            <OrderOverview
              key={index}
              statusResPerBpp={res}
              handleMenuDotsClick={() => handleMenuDotsClick(res)}
            />
            <BottomModal
              isOpen={isCancelMenuModalOpen}
              onClose={() => setIsCancelMenuModalOpen(false)}
              title={t.courseCancellation}
              dataTest={testIds.orderDetailspage_cancelOrder}
            >
              {isLoadingForCancel ? (
                <LoaderWithMessage
                  loadingText={t.pleaseWait}
                  loadingSubText={t.cancelLoaderSubText}
                />
              ) : (
                <CancelOrderForm
                  isProceedDisabled={isProceedDisabled}
                  setIsProceedDisabled={setIsProceedDisabled}
                  radioValue={radioValue}
                  setRadioValue={setRadioValue}
                  handleCancelSubmit={() => handleCancelSubmit(res, cancellationId as string)}
                />
              )}
            </BottomModal>
          </>
        )
      })}

      {/* Billing details */}

      <ShippingOrBillingDetails
        name={name}
        location={address}
        number={phone}
        handleEditClick={() => setIsAddressUpdateModalOpen(true)}
        dataTest={testIds.orderDetailspage_billingDetails}
      />

      <Accordion
        accordionHeader={t.paymentText}
        dataTest={testIds.orderDetailspage_paymentDetails_container}
      >
        {!!statusResponse.data && (
          <Box>
            <Flex
              pb={'10px'}
              mt={'20px'}
              justifyContent={'space-between'}
            ></Flex>
            {/* <DetailCard> */}
            <Box
              p={'20px'}
              pt={'unset'}
            >
              {statusResponse.data.map((data, idx) => {
                return (
                  <PaymentDetails
                    key={idx}
                    paymentBreakDown={getPaymentBreakDown(data).breakUpMap}
                    totalText={t.total}
                    totalValueWithCurrency={getPaymentBreakDown(data).totalPricewithCurrent}
                    dataTest={testIds.orderDetailspage_paymentDetails}
                  />
                )
              })}
            </Box>
          </Box>
        )}
      </Accordion>

      {/* order support/cancel */}
      <BottomModal
        title=""
        isOpen={isMenuModalOpen}
        dataTest={testIds.orderDetailspage_menus}
        onClose={() => setIsMenuModalOpen(false)}
      >
        {isLoadingForTrackAndSupport ? (
          <Box
            display={'flex'}
            alignItems="center"
            justifyContent={'center'}
            height={'300px'}
          >
            <LoaderWithMessage
              loadingText={t.categoryLoadPrimary}
              loadingSubText={t.fetchingTrackLoaderSubtext}
            />
          </Box>
        ) : (
          <Stack
            gap="20px"
            p={'20px 0px'}
          >
            {menuItems(trackResponse as TrackingResponseModel).map((menuItem, index) => (
              <Flex
                key={index}
                columnGap="10px"
                alignItems="center"
                onClick={menuItem.onClick}
                data-test={testIds.orderDetailspage_menuItem}
              >
                <Image src={menuItem.image} />
                <Text
                  as={Typography}
                  text={menuItem.text as string}
                  dataTest={testIds.orderDetailspage_menuItemName}
                  fontSize="15px"
                  fontWeight={400}
                />
              </Flex>
            ))}
            <Divider />
            {callMenuItem(SupportResponse as SupportResponseModel).map((menuItem, index) => (
              <Flex
                key={index}
                columnGap="10px"
                alignItems="center"
                onClick={menuItem.onClick}
                data-test={testIds.orderDetailspage_callServiceItem}
              >
                <Image src={menuItem.image} />
                <Text
                  as={Typography}
                  text={menuItem.text}
                  dataTest={testIds.orderDetailspage_callServiceItemName}
                  fontSize="15px"
                  fontWeight={400}
                />
              </Flex>
            ))}
          </Stack>
        )}
      </BottomModal>

      {/* Address update modal */}
      <BottomModal
        title={t.addBillingdetailsBtnText}
        isOpen={isAddressUpdateModalOpen}
        onClose={() => setIsAddressUpdateModalOpen(false)}
      >
        <UpdateAddressDetailForm handleFormSubmit={formData => handleUpdateFormSubmit(formData, statusResponse)} />
      </BottomModal>
    </Box>
  )
}

export default OrderDetails
