import { DetailCard, OrderStatusProgress, OrderStatusProgressProps } from '@beckn-ui/becknified-components'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import {
  ConfirmResponseModel,
  DataState,
  formatTimestamp,
  getPaymentBreakDown,
  Item,
  QuantityDetails,
  StatusResponseModel
} from '@beckn-ui/common'
import { Accordion, Typography } from '@beckn-ui/molecules'
import { Box, CardBody, Flex, Text, Image, Divider, useDisclosure } from '@chakra-ui/react'
import { ItemMetaData, ORG_NAME_MAP } from '@components/credLayoutRenderer/ItemRenderer'
import ShippingBlock from '@components/orderDetailComponents/Shipping'
import { AttestationData } from '@lib/types/becknDid'
import axios from '@services/axios'
import { useDecodeStreamMutation } from '@services/walletService'
import { AuthRootState } from '@store/auth-slice'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import ProfileIcon from '@public/images/Profile.svg'
import ChargingIcon from '@public/images/charging_icon.svg'
import { useLanguage } from '@hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'
import { ParentStatusKey, ParentStatusMap, StatusKey, statusMap } from '@lib/client'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'

const DELIVERED = 'ORDER_DELIVERED'
const CANCELLED = 'USER CANCELLED'
const CHARGING_STATUS = 'CHARGING_STATUS'

export default function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState<{ data: ConfirmResponseModel[] }>()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [statusData, setStatuData] = useState<any>()
  const [orderStatusMap, setOrderStatusMap] = useState<any[]>([])
  const [currentStatusLabel, setCurrentStatusLabel] = useState('')
  const [attestationsDetails, setAttestationsDetails] = useState<{ name: string; icon: string }[]>([
    // { name: 'Open Wallet' },
    // { name: 'Open Spark' }
  ])
  const domain = orderDetails?.data?.context.domain
  console.log(domain)
  const router = useRouter()
  const { t } = useLanguage()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [decodeStream, { isLoading }] = useDecodeStreamMutation()
  const { user } = useSelector((state: AuthRootState) => state.auth)

  const getDecodedStreamData = async (data: ItemMetaData) => {
    const decodedRes: any = await decodeStream({ subjectId: data.data.did })
    console.log('Decoded:', decodedRes)
    setOrderDetails(decodedRes)
  }

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

  const getAttestationItems = (item: any) => {
    const attestations: AttestationData[] = item?.data.attestations
    console.log('attestations', attestations)
    if (attestations?.length > 0) {
      const result: any = attestations
        .map(attestation => {
          const regex = /\/type\/([^\/]+)\//

          if (attestation.verification_method.did.startsWith(user?.did!)) {
            const orgData = { name: 'Self', icon: ProfileIcon }

            return orgData ? { name: orgData.name, icon: orgData.icon } : null
          }
          if (attestation.did.match(regex)) {
            const match = attestation.did.match(regex)

            if (!match) return null

            const domainType = match[1]
            const orgData = ORG_NAME_MAP[domainType]

            return orgData
              ? {
                  name: orgData.name,
                  icon: orgData.icon, //`/images/${orgData.name === 'Vault' ? 'attes_openwallet' : 'attes_openspark'}.svg`,
                  data: attestation
                }
              : null
          }
        })
        .filter(Boolean)
      console.log(result)
      setAttestationsDetails(result)
    }
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem('orderData')) {
      const storedData = JSON.parse(localStorage.getItem('orderData') as string)
      getDecodedStreamData(storedData)
      getAttestationItems(storedData)
    }
    return () => {
      localStorage.removeItem('orderData')
      localStorage.removeItem('orderStatusMap')
      localStorage.removeItem('statusResponse')
    }
  }, [])

  useEffect(() => {
    const fetchData = () => {
      if (orderDetails) {
        const { bpp_id, bpp_uri, domain } = orderDetails?.data?.context
        const { orderId } = orderDetails?.data?.message
        const statusPayload = {
          data: [
            {
              context: {
                transaction_id: uuidv4(),
                bpp_id: bpp_id,
                bpp_uri: bpp_uri,
                domain: domain || 'deg:retail'
              },
              message: {
                order_id: orderId,
                orderId: orderId
              }
            }
          ]
        }
        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            const resData = res.data.data
            console.log('Status data', resData)
            setStatuData(resData)
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            console.log('object')
          })
      }
    }
    fetchData()

    const intervalId = setInterval(fetchData, 30000)
    return () => clearInterval(intervalId)
  }, [apiUrl, orderDetails])

  const totalQuantityOfOrder = (data: any) => {
    let count = 0
    data[0].message.order.items.forEach((item: Item) => {
      count += (item.quantity as QuantityDetails)?.selected?.count
    })
    return count
  }

  useEffect(() => {
    if (statusData?.length > 0) {
      const newData = statusData
        .map((status: StatusResponseModel) => {
          const { tags } = status?.message?.order
          let statusKey: string = status?.message?.order?.fulfillments[0]?.state?.descriptor?.code as StatusKey
          if (
            statusKey === 'CHARGING_STATUS' &&
            Number(status?.message?.order?.fulfillments[0]?.state?.descriptor?.short_desc) === 100
          ) {
            statusKey = 'CHARGING_COMPLETED'
          } else if (
            statusKey === 'CHARGING_STATUS' &&
            Number(status?.message?.order?.fulfillments[0]?.state?.descriptor?.short_desc) < 100
          ) {
            statusKey = 'CHARGING_IN_PROGRESS'
          } else if (statusKey === 'timestamp') {
            statusKey = 'ORDER_DELIVERED'
          }
          return {
            label: statusMap[statusKey as StatusKey],
            statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at || status?.context?.timestamp
          }
        })
        .filter((status: any) => status.label)

      const labelSet = new Set(orderStatusMap.map(status => status.label))
      setOrderStatusMap(prevState => [...prevState, ...newData.filter((status: any) => !labelSet.has(status.label))])
    }
  }, [statusData])

  let isDelivered = orderDetails?.data?.message?.fulfillments?.[0]?.state?.descriptor?.code === DELIVERED

  if (
    statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === CHARGING_STATUS &&
    Number(statusData[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.short_desc) === 100
  ) {
    isDelivered = true
  } else if (
    statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === CHARGING_STATUS &&
    Number(statusData[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.short_desc) < 100
  ) {
    isDelivered = false
  } else if (statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === 'timestamp') {
    isDelivered = true
  }
  const isCancelled = orderDetails?.data?.message?.fulfillments?.[0]?.state?.descriptor?.code === CANCELLED

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      {orderDetails && statusData ? (
        <>
          <Box
            pb="15px"
            pt="20px"
          >
            <Typography
              variant="subTitleRegular"
              text={'Order Overview'}
              fontSize="17px"
            />
          </Box>

          <DetailCard>
            <Flex>
              {statusData && (
                <Image
                  mr={'15px'}
                  height={['60px', '80px', '80px', '80px']}
                  w={['40px', '80px', '80px', '80px']}
                  src={statusData[0]?.message?.order?.items[0]?.images?.[0].url}
                  alt="product image"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.src = ChargingIcon
                  }}
                />
              )}
              <Box w={'100%'}>
                <Box
                  pt={'unset'}
                  pb={4}
                >
                  {statusData && (
                    <Typography
                      variant="subTitleSemibold"
                      dataTest={testIds.orderDetailspage_productName}
                      text={statusData[0]?.message?.order?.items[0]?.name}
                    />
                  )}
                </Box>

                <Flex
                  pt={'unset'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="subTitleRegular"
                    text={'Placed at'}
                  />
                  <Typography
                    variant="subTitleRegular"
                    dataTest={testIds.orderDetailspage_productPlacedAt}
                    text={formatTimestamp(orderDetails?.data?.context?.timestamp!)}
                  />
                </Flex>
              </Box>
            </Flex>
          </DetailCard>

          {/* Progress Summary */}
          <Box pt={4}>
            <Typography
              variant="subTitleRegular"
              text="Progress Summary"
              fontSize="17px"
            />
          </Box>

          <DetailCard>
            <CardBody p={'unset'}>
              <>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    as={Typography}
                    text={`Order Id:  ${orderDetails?.data?.message?.orderId}`}
                    fontSize="17px"
                    fontWeight="600"
                  />
                  {/* <Image
                src="/images/threeDots.svg"
                alt="threeDots"
                cursor={'pointer'}
              /> */}
                </Flex>

                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Flex maxWidth={'40vw'}>
                    <Text
                      textOverflow={'ellipsis'}
                      overflow={'hidden'}
                      whiteSpace={'nowrap'}
                      fontSize={'12px'}
                      fontWeight={'400'}
                      data-test={testIds.orderDetailspage_orderSummaryItemName}
                    >
                      {statusData[0]?.message?.order?.items[0]?.name}
                    </Text>
                    {totalQuantityOfOrder(statusData) > 1 && (
                      <Text
                        pl={'5px'}
                        color={'green'}
                        fontSize={'12px'}
                        fontWeight={'600'}
                        data-test={testIds.orderDetailspage_orderSummaryTotalItems}
                        onClick={onOpen}
                      >
                        +{totalQuantityOfOrder(statusData) - 1}
                      </Text>
                    )}
                  </Flex>

                  <Text
                    fontSize={'12px'}
                    fontWeight={'500'}
                    data-test={testIds.orderDetailspage_orderStatus}
                    color={
                      statusData?.[0]?.message.order.status === 'CANCELLED'
                        ? 'red'
                        : statusData?.[0]?.message.order.status === 'ACTIVE'
                          ? '#BD942B'
                          : 'green'
                    }
                  >
                    {ParentStatusMap[statusData[0].message.order.status as ParentStatusKey]}
                  </Text>
                </Flex>
              </>
              <Divider
                mr={'-20px'}
                ml="-20px"
                width={'unset'}
                pt="15px"
              />

              <Box className="order_status_progress">
                {orderStatusMap.map((status: OrderStatusProgressProps, index: number) => (
                  <OrderStatusProgress
                    key={index}
                    label={status.label}
                    statusTime={status.statusTime && formatTimestamp(status.statusTime)}
                    noLine={isDelivered || isCancelled}
                    lastElement={orderStatusMap.length - 1 === index}
                  />
                ))}
              </Box>
            </CardBody>
          </DetailCard>

          <Accordion accordionHeader={'Shipping & Billing'}>
            <ShippingBlock
              name={{ text: orderDetails?.data?.message?.billing?.name!, icon: '/images/nameIcon.svg' }}
              address={{ text: orderDetails?.data?.message?.billing?.address!, icon: '/images/locationIcon1.svg' }}
              mobile={{ text: orderDetails?.data?.message?.billing?.phone!, icon: '/images/CallphoneIcon.svg' }}
            />
          </Accordion>

          <Accordion accordionHeader={'Payment'}>
            <Box
              pl={'14px'}
              pr={'11px'}
              pb={'11px'}
              pt={'6px'}
            >
              {statusData && (
                <PaymentDetails
                  paymentBreakDown={getPaymentBreakDown(statusData).breakUpMap}
                  totalText="Total"
                  totalValueWithCurrency={getPaymentBreakDown(statusData).totalPricewithCurrent}
                />
              )}
            </Box>
          </Accordion>

          <Accordion accordionHeader={'Attested by'}>
            {attestationsDetails.map((item, index) => (
              <Flex
                pl={'20px'}
                pr={'20px'}
                pb={'11px'}
                pt={'6px'}
                justify="space-between"
                key={index}
              >
                <Typography
                  text={item.name}
                  fontSize="16px"
                  fontWeight="500"
                />
                <Image
                  src={item.icon}
                  alt={item.name}
                  width="24px"
                  height="24px"
                />
              </Flex>
            ))}
          </Accordion>
        </>
      ) : (
        <Box
          display={'grid'}
          height={'calc(100vh - 300px)'}
          alignContent={'center'}
        >
          <LoaderWithMessage
            loadingText={''}
            loadingSubText={''}
          />
        </Box>
      )}
    </Box>
  )
}
