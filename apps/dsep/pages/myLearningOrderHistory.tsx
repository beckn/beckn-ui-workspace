import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '../components/loader/Loader'
import MyLearing from '../components/orderHistory/MyLearing'
import { useLanguage } from '../hooks/useLanguage'
import { getOrderPlacementTimeline } from '../utilities/confirm-utils'

const myLearningOrderHistory = () => {
  const [coursesOrders, setCoursesOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const fetchCoursesOrders = async () => {
    const bearerToken = Cookies.get('authToken')
    let myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    } as RequestInit

    fetch(`${apiUrl}/orders?filters[category]=1`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setCoursesOrders(result.data)
        setIsLoading(false)
      })
      .catch(error => console.error('error', error))
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
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      {coursesOrders.map((courseOrder: any, index) => (
        <MyLearing
          key={index}
          heading={courseOrder.attributes.items[0].descriptor.name}
          time={getOrderPlacementTimeline(courseOrder.attributes.createdAt)}
          id={courseOrder.id}
          myLearingStatus={courseOrder.attributes.delivery_status}
          handleViewCourses={() => {
            window.location.href = courseOrder.attributes.items[0].tags.Url
          }}
        />
      ))}
    </Box>
  )
}

export default myLearningOrderHistory
