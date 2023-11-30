import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { convertTimestampToDdMmYyyyHhMmPM } from '../utilities/confirm-utils'
import MyCases from '../components/orderHistory/MyCases'
import Loader from '../components/loader/Loader'
import Nocases from '../components/noCases/Nocases'

const myCasesOrderHistory = () => {
  const [casesOrders, setCasesOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const fetchCoursesOrders = async () => {
    try {
      const bearerToken = Cookies.get('authToken')
      const myHeaders = new Headers()
      myHeaders.append('Authorization', `Bearer ${bearerToken}`)

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      } as RequestInit

      const response = await fetch(`${apiUrl}/orders?filters[category]=4`, requestOptions)
      const result = await response.json()

      setCasesOrders(result.data)
      setIsLoading(false)
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    fetchCoursesOrders()
  }, [])

  if (isLoading) {
    return <Loader loadingText={t.fetchingCases} />
  }

  if (!casesOrders.length) {
    return <Nocases />
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {casesOrders.map((courseOrder: any, index) => (
        <MyCases
          key={index}
          providerName={courseOrder.attributes.descriptor.name}
          heading={courseOrder.attributes.items[0].name}
          time={convertTimestampToDdMmYyyyHhMmPM(courseOrder.attributes.createdAt)}
          id={courseOrder.id}
          myLearingStatus={courseOrder.attributes.delivery_status}
          handleViewCaseDetails={() => {
            const confirmedOrder = {
              scholarshipApplicationId: courseOrder.attributes.order_id,
              context: {
                // transactionId: '',
                bppId: courseOrder.attributes.bpp_id,
                bppUri: courseOrder.attributes.bpp_uri
              }
            }
            localStorage.setItem('confirmData', JSON.stringify(confirmedOrder))
            if (localStorage.getItem('confirmData')) {
              Router.push('/orderDetails')
            }
          }}
        />
      ))}
    </Box>
  )
}

export default myCasesOrderHistory
