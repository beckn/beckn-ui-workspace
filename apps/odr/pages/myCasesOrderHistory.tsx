import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '../components/loader/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { getOrderPlacementTimeline } from '../utilities/confirm-utils'
import MyCases from '../components/orderHistory/MyCases'

const myCasesOrderHistory = () => {
  const [coursesOrders, setCoursesOrders] = useState([])
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

      const response = await fetch(`${apiUrl}/orders?filters[category]=1`, requestOptions)
      const result = await response.json()
      console.log(result.data)
      setCoursesOrders(result.data)
      setIsLoading(false)
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    fetchCoursesOrders()
  }, [])

  if (isLoading) {
    return <Loader loadingText={t.fetchingScholarships} />
  }

  if (!coursesOrders.length) {
    return <></>
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {coursesOrders.map((courseOrder: any, index) => (
        <MyCases
          key={index}
          heading={courseOrder.attributes.items[0].descriptor.name}
          time={getOrderPlacementTimeline(courseOrder.attributes.createdAt)}
          id={courseOrder.id}
          myLearingStatus={courseOrder.attributes.delivery_status}
          handleViewCourses={() => {
            Router.push('/orderDetails')
          }}
        />
      ))}
    </Box>
  )
}

export default myCasesOrderHistory
