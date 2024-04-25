import {
  Box,
  CardBody,
  Divider,
  Flex,
  Text,
  Image,
  Card,
  useDisclosure,
  Stack,
  RadioGroup,
  Textarea,
  Radio
} from '@chakra-ui/react'
import { DetailCard, ProductPrice } from '@beckn-ui/becknified-components'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Accordion, BottomModal, Typography } from '@beckn-ui/molecules'
import axios from 'axios'
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
import TrackIcon from '../public/images/TrackIcon.svg'
import ViewMoreOrderModal from '../components/orderDetails/ViewMoreOrderModal'
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

// TODO :- to check this order details component

const OrderDetails = () => {
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel | null>(null)
  const [statusResponse, setStatusResponse] = useState<StatusResponseModel | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string
  const statusRequest = useRequest()
  const router = useRouter()
  const { orderId } = router.query
  const [status, setStatus] = useState('progress')
  const [SupportResponse, setSupportResponse] = useState<SupportResponseModel | null>(null)
  const [trackResponse, setTrackResponse] = useState<TrackingResponseModel | null>(null)
  const [isLoadingForTrackAndSupport, SetIsLoadingForTrackAndSupport] = useState(true)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [isAddressUpdateModalOpen, setIsAddressUpdateModalOpen] = useState(false)
  const [isCancelMenuModalOpen, setIsCancelMenuModalOpen] = useState(false)
  const [isProceedDisabled, setIsProceedDisabled] = useState(true)
  const [radioValue, setRadioValue] = useState('')
  const [isLoadingForCancel, setIsLoadingForCancel] = useState(false)

  const { t } = useLanguage()

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmResponse: ConfirmResponseModel = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setConfirmData(parsedConfirmResponse)
    }
  }, [])

  useEffect(() => {
    if (confirmData) {
      const statusPayload = getStatusPayload(confirmData)
      statusRequest.fetchData(`${apiUrl}/status`, 'POST', statusPayload)
    }
  }, [confirmData])

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

  if (!statusResponse || statusRequest.error) {
    return <></>
  }

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
        window.open(trackResponse?.data[0].message.tracking.url, '_blank')
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

  const handleMenuDotsClick = async () => {
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

      if (updateResponse) {
        setIsAddressUpdateModalOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancelSubmit = async (statusResponse: StatusResponseModel, cancellationId: string) => {
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
        >
          <Image
            src="/images/jobSearch.svg"
            alt=" "
          />

          <Typography
            style={{
              paddingLeft: '8px'
            }}
            text={t.lookingtojobs}
            variant="titleSemibold"
          />
        </Flex>
        <Box pl={'28px'}>
          <Typography
            fontSize={'15px'}
            text={t.jobChangeInfo}
            variant="subTextRegular"
          />
          <Link href={'/jobSearch'}>
            <Typography
              style={{
                cursor: 'pointer'
              }}
              text={t.searchForJob}
              color="rgba(var(--color-primary))"
              variant="subTextRegular"
              fontSize="15px"
            />
          </Link>
        </Box>
      </DetailCard>
      {filteredOrder.length === totalOrdersQty ? (
        <Card
          mb={'20px'}
          border={'1px solid rgba(94, 196, 1, 1)'}
          className="border_radius_all"
        >
          <CardBody padding={'15px 20px'}>
            <Flex
              alignItems={'center'}
              pb={'3px'}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                width={'12px'}
                height={'13px'}
                src={TrackIcon}
              />
              <Text
                pl={'8px'}
                fontSize={'17px'}
                fontWeight={'600'}
              >
                All orders delivered!
              </Text>
            </Flex>
            <Flex
              alignItems={'center'}
              fontSize={'15px'}
              pl={'20px'}
            >
              <Text>How did we do?</Text>
              <Text
                onClick={() => router.push('/feedback')}
                pl={'10px'}
                color={'rgba(var(--color-primary))'}
              >
                Rate Us
              </Text>
            </Flex>
          </CardBody>
        </Card>
      ) : null}

      <DetailCard>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          pb="10px"
        >
          <Box
            fontWeight={600}
            fontSize={'17px'}
          >
            {t.orderSummary}
          </Box>
          <Image
            onClick={handleMenuDotsClick}
            src="/images/threeDots.svg"
            alt="icon-to-open-menu-modal"
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
          />
          <Typography
            text={formatTimestamp(timestamp)}
            variant={'subTitleRegular'}
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
          />
          <Typography
            text={`${filteredOrder.length} of ${totalOrdersQty}`}
            variant={'subTitleRegular'}
          />
        </Flex>
      </DetailCard>

      {statusResponse?.data.map((res, index: number) => {
        const orderStatus = res.message.order.fulfillments[0].state.descriptor.short_desc
        return (
          <Accordion
            key={index}
            accordionHeader={
              <Box>
                <Flex
                  mb={'15px'}
                  fontSize={'17px'}
                  alignItems={'center'}
                >
                  <Typography
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                    fontWeight={'600'}
                    fontSize={'17px'}
                    text={`${t.orderId}: ${res.message.order.id}`}
                    variant={'subTitleRegular'}
                  />
                </Flex>
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Flex maxWidth={'57vw'}>
                    <Typography
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                      text={res.message.order.items[0].name}
                      variant={'subTitleRegular'}
                    />
                    {totalItemsInAnOrder(res) > 1 && (
                      <Typography
                        onClick={onOpen}
                        style={{
                          paddingLeft: '5px'
                        }}
                        color="rgba(var(--color-primary))"
                        fontSize="600"
                        text={`+${totalItemsInAnOrder(res) - 1}`}
                        variant={'subTitleRegular'}
                      />
                    )}
                  </Flex>
                  <Typography
                    fontWeight="600"
                    text={orderStatus}
                    color={'#FDC025'}
                    variant={'subTitleRegular'}
                  />
                </Flex>
              </Box>
            }
          >
            <ViewMoreOrderModal
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              items={res.message.order.items}
              orderId={res.message.order.id}
            />
            <Divider mb={'20px'} />
            <CardBody
              pt={'unset'}
              fontSize={'15px'}
            >
              <Box>
                <Flex alignItems={'center'}>
                  <Image
                    src="/images/done.svg"
                    alt=""
                  />
                  <Typography
                    style={{
                      paddingLeft: '8px'
                    }}
                    fontWeight="600"
                    text={t.coursesPurchased}
                    variant={'subTitleRegular'}
                  />
                </Flex>
                <Typography
                  style={{
                    paddingLeft: '28px'
                  }}
                  text={formatTimestamp(timestamp)}
                  variant={'subTitleRegular'}
                />
              </Box>
              {status === 'progress' ? (
                <Box
                  fontSize={'15px'}
                  color={'rgba(var(--color-primary))'}
                  pt="10px"
                  pl="28px"
                  // onClick={handleViewCource}
                  // TODO :- TO check for the presence of course URL in the status response
                  onClick={() => {}}
                >
                  {t.viewCourse}
                </Box>
              ) : null}
            </CardBody>
          </Accordion>
        )
      })}

      {/* Billing details */}

      <ShippingOrBillingDetails
        name={name}
        location={address}
        number={phone}
        handleEditClick={() => setIsAddressUpdateModalOpen(true)}
      />

      <Accordion accordionHeader={t.paymentText}>
        <CardBody
          pt={'unset'}
          pb={'unset'}
        >
          <Flex
            pb={'15px'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              text={t.subTotal}
              variant={'subTitleRegular'}
            />

            <ProductPrice
              price={orderSubTotal}
              currencyType={currency}
              color={'#000000'}
            />
          </Flex>
          <Flex
            pb={'15px'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              text={t.scholaarshipApplied}
              variant={'subTitleRegular'}
            />
            <Box display={'flex'}>
              <Typography
                text={'-'}
                variant={'subTitleRegular'}
              />

              <ProductPrice
                price={orderSubTotal}
                currencyType={currency}
                color={'#000000'}
              />
            </Box>
          </Flex>
          <Divider />
        </CardBody>
        <CardBody
          pb={'unset'}
          pt={'15px'}
        >
          <Flex
            pb={'15px'}
            justifyContent={'space-between'}
            alignItems={'center'}
            fontSize={'17px'}
            fontWeight={'600'}
          >
            <Typography
              text={t.total}
              variant={'subTitleRegular'}
            />
            <ProductPrice
              price={0.0}
              currencyType={currency}
              color={'#000000'}
            />
          </Flex>
          <Flex
            fontSize={'15px'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pb={'15px'}
          >
            <Typography
              text={t.paymentMethod}
              variant={'subTitleRegular'}
            />
            <Typography
              text={t.naText}
              variant={'subTitleRegular'}
            />
          </Flex>
        </CardBody>
      </Accordion>

      {/* order support/cancel */}
      <BottomModal
        title=""
        isOpen={isMenuModalOpen}
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
              >
                <Image src={menuItem.image} />
                <Text
                  as={Typography}
                  text={menuItem.text}
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
              >
                <Image src={menuItem.image} />
                <Text
                  as={Typography}
                  text={menuItem.text}
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

      {/* order cancellation modal */}
      <BottomModal
        isOpen={isCancelMenuModalOpen}
        onClose={() => setIsCancelMenuModalOpen(false)}
        title={t.courseCancellation}
        // modalHeader={t.orderCancellation}
      >
        {false ? (
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
            handleCancelSubmit={() => handleCancelSubmit(statusResponse, cancellationId as string)}
          />
        )}
      </BottomModal>
    </Box>
  )
}

export default OrderDetails
