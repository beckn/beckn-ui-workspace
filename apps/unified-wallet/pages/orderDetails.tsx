import { DetailCard } from '@beckn-ui/becknified-components'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import { ConfirmResponseModel, formatTimestamp, getOrderDetailsPaymentBreakDown } from '@beckn-ui/common'
import { Accordion, Typography } from '@beckn-ui/molecules'
import { Box, CardBody, Flex, Text, Image, Divider } from '@chakra-ui/react'
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import ShippingBlock from '@components/orderDetailComponents/Shipping'
import { DOMAIN } from '@lib/config'
import axios from '@services/axios'
import { useDecodeStreamMutation } from '@services/walletService'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const attestionItem = [
  {
    name: 'Vault',
    icon: '/images/vault.svg'
  },
  {
    name: 'Spark',
    icon: '/images/attes_openspark.svg'
  }
]

export default function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState<{ data: ConfirmResponseModel[] }>()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [statusData, setStatuData] = useState()

  const router = useRouter()
  const [decodeStream, { isLoading }] = useDecodeStreamMutation()

  const getDecodedStreamData = async (data: ItemMetaData) => {
    console.log(data)
    const decodedRes: any = await decodeStream({ subjectId: data.data.did })
    console.log('Decoded:', decodedRes)
    setOrderDetails(decodedRes)
  }

  useEffect(() => {
    let data
    if (localStorage && localStorage.getItem('orderData')) {
      console.log('data1', data)
      const storedData = localStorage.getItem('orderData')
      if (storedData) {
        data = JSON.parse(storedData)
        getDecodedStreamData(data)
      }
    }
  }, [])

  useEffect(() => {
    console.log(orderDetails)
    const fetchData = () => {
      if (orderDetails) {
        console.log(orderDetails)
        const { bpp_id, bpp_uri, domain } = orderDetails?.data[0]?.context
        const { orderId } = orderDetails?.data[0]?.message
        const statusPayload = {
          data: [
            {
              context: {
                transaction_id: uuidv4(),
                bpp_id: bpp_id,
                bpp_uri: bpp_uri,
                domain: domain || 'dg retail'
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

  return (
    <Box>
      <Box pt={4}>
        <Typography
          variant="subTitleRegular"
          text="Order Overview"
          fontSize="17px"
        />
      </Box>

      <DetailCard>
        <Flex
          direction="column"
          gap={2}
        >
          <Flex justify="space-between">
            <Typography
              text={'Placed at'}
              fontSize="15px"
              fontWeight="400"
            />
            <Typography
              text={formatTimestamp(orderDetails?.data[0]?.context?.timestamp!)}
              fontSize="15px"
              fontWeight="400"
            />
          </Flex>
          <Flex justify="space-between">
            <Typography
              text={'Orders Fulfilled'}
              fontSize="15px"
              fontWeight="400"
            />
            <Typography
              text={'0 of 2'}
              fontSize="15px"
              fontWeight="400"
            />
          </Flex>
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
                text={`Order Id:  ${orderDetails?.data[0]?.message?.orderId}`}
                fontSize="17px"
                fontWeight="600"
              />
              <Image
                src="/images/threeDots.svg"
                alt="threeDots"
                cursor={'pointer'}
              />
            </Flex>

            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Flex maxWidth={'40vw'}>
                {/* <Text
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  fontSize={'12px'}
                  fontWeight={'400'}
                >
                  {' 150Ah Tubular Battery by ebatterystore +1  '}
                </Text> */}

                <Typography
                  text={orderDetails?.data?.[0]?.message?.items?.[0]?.name}
                  fontSize="12px"
                  fontWeight="400"
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}
                />
              </Flex>

              <Text
                fontSize={'15px'}
                fontWeight={'500'}
                color={'#BD942B'} // change base on status
              >
                {'pending'}
              </Text>
            </Flex>
          </>
          <Divider
            mr={'-20px'}
            ml="-20px"
            width={'unset'}
            pt="15px"
          />
          {/* <Box className="order_status_progress">
            {orderStatuses.map((status, index) => (
              <OrderStatusProgress
                key={index}
                label={status.title}
                statusTime={status.statusTime && formatTimestamp(status.statusTime)}
                noLine={isDelivered || isCancelled}
                lastElement={orderStatuses.length - 1 === index}
              />
            ))}
          </Box> */}
        </CardBody>
      </DetailCard>

      <Accordion accordionHeader={'Shipping & Billing'}>
        <ShippingBlock
          name={{ text: orderDetails?.data[0]?.message?.billing?.name!, icon: '/images/nameIcon.svg' }}
          address={{ text: orderDetails?.data[0]?.message?.billing?.address!, icon: '/images/locationIcon1.svg' }}
          mobile={{ text: orderDetails?.data[0]?.message?.billing?.phone!, icon: '/images/CallphoneIcon.svg' }}
        />
      </Accordion>

      <Accordion accordionHeader={'Payment'}>
        <Box
          pl={'14px'}
          pr={'11px'}
          pb={'11px'}
          pt={'6px'}
        >
          <PaymentDetails
            paymentBreakDown={orderDetails?.data ? getOrderDetailsPaymentBreakDown(orderDetails?.data).breakUpMap : {}}
            totalText="Total"
            totalValueWithCurrency={
              orderDetails?.data
                ? getOrderDetailsPaymentBreakDown(orderDetails.data).totalPricewithCurrent
                : { value: '0', currency: 'INR' }
            }
          />
        </Box>
      </Accordion>

      <Accordion accordionHeader={'Attested by'}>
        {attestionItem.map((item, index) => (
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
            />
          </Flex>
        ))}
      </Accordion>
    </Box>
  )
}
