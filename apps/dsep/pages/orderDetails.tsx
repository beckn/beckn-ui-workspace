import { Box, CardBody, Divider, Flex, Text, Image, Card, useDisclosure, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { formatTimestamp } from '../utilities/confirm-utils'
import { getStatusPayload } from '../utilities/orderDetails-utils'
import TrackIcon from '../public/images/TrackIcon.svg'
import ViewMoreOrderModal from '../components/orderDetails/ViewMoreOrderModal'
import { useSelector } from 'react-redux'
import { TransactionIdRootState } from '../lib/types/cart'
import useRequest from '../hooks/useRequest'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ConfirmResponseModel } from '../lib/types/confirm.types'
import { StatusData, StatusResponseModel } from '../lib/types/status.types'
import { DetailCard, ProductPrice } from '@beckn-ui/becknified-components'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Accordion, Typography } from '@beckn-ui/molecules'

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
        }
      }
    }
  } = data[0]
  const { timestamp } = context
  const totalItemsInAnOrder = (bppStatusData: StatusData) => {
    return bppStatusData.message.order.items.length
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
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
        <Box
          fontWeight={600}
          fontSize={'17px'}
          pr={'8px'}
          pb="10px"
        >
          {t.orderSummary}
        </Box>
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

      {statusResponse?.data.map((res, index: number) => (
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
                {status === 'progress' ? (
                  <Typography
                    fontWeight="600"
                    text="In Progress"
                    color={'#FDC025'}
                    variant={'subTitleRegular'}
                  />
                ) : (
                  <Typography
                    fontWeight="600"
                    text="Completed"
                    color={'#FDC025'}
                    variant={'subTitleRegular'}
                  />
                )}
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
      ))}
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
    </Box>
  )
}

export default OrderDetails
