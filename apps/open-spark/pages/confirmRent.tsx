import { useState } from 'react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import type React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { feedbackActions, type ICartRootState } from '@beckn-ui/common'
import { useDispatch, useSelector } from 'react-redux'
import { DOMAIN_PATH } from '@lib/config'
import { prepareApiPayload } from '../utilities/confirmRent-utils'
import type { CartItem } from '../lib/types/rentalTypes'
import { setOrderData } from '@store/rental-slice'
import CustomTimePicker from '@components/dateTimePicker/customTimePicker'
import CustomDatePicker from '@components/dateTimePicker/customDatePicker'

export default function ConfirmRent() {
  const [fromTime, setFromTime] = useState<Date>(new Date())
  const [toTime, setToTime] = useState<Date>(new Date())
  const [date, setDate] = useState<string>(new Date().toISOString())
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items) as CartItem[]

  const handleConfirm = async () => {
    const formTimestamp = Math.floor(new Date(fromTime).getTime() / 1000)
    const toTimestamp = Math.floor(new Date(toTime).getTime() / 1000)
    localStorage.setItem('fromTimestamp', formTimestamp.toString())
    localStorage.setItem('toTimestamp', toTimestamp.toString())
    const domain = DOMAIN_PATH.RENT_AND_HIRE
    const payload = prepareApiPayload(cartItems, formTimestamp, toTimestamp, domain)

    try {
      const response = await fetch(`${apiUrl}/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('API Response:', responseData?.data[0]?.message)
        if (!responseData?.data[0]?.message.order.items) {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Time slot Unavailable',
                display: true,
                type: 'error',
                description: 'Please select a different time.'
              }
            })
          )
        } else {
          dispatch(setOrderData(responseData?.data[0]))
          router.push('/checkout')
        }
      } else {
        console.error('API Error:', response.statusText)
      }
    } catch (error) {
      console.error('Network Error:', error)
    }
  }

  return (
    <Box
      mt={5}
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
      mb={5}
    >
      <Box mb={9}>
        <Text
          mb={3}
          fontSize="16px"
        >
          Select Date
        </Text>
        <Flex align="center">
          <CustomDatePicker
            selected={new Date(date)}
            placeholderText="Select 'from' date"
            onChange={(date: any) => setDate(date?.toISOString())}
            dateFormat="dd-MM-yyyy"
            isInvalid={false}
          />
        </Flex>
      </Box>

      <Box mb={6}>
        <Text
          mb={3}
          fontSize="16px"
        >
          Select Time
        </Text>
        <Flex
          align="center"
          flexDir={'column'}
        >
          <Flex align="center">
            <CustomTimePicker
              selected={fromTime}
              placeholderText="Select 'from'"
              onChange={(date: any) => setFromTime(date)}
              dateFormat="h:mm aa"
              isInvalid={false}
            />
            <Text mx={3}>-</Text>
            <CustomTimePicker
              selected={toTime}
              placeholderText="Select 'to'"
              onChange={(date: any) => setToTime(date)}
              dateFormat="h:mm aa"
              isInvalid={false}
            />
          </Flex>
        </Flex>
      </Box>
      <Box mt={'250px'}>
        <BecknButton
          children="Confirm & Proceed"
          handleClick={handleConfirm}
        />
      </Box>
    </Box>
  )
}
