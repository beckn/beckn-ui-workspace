import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Loader from '../components/loader/Loader'
import MyLearing from '../components/orderHistory/MyLearing'
import { useLanguage } from '../hooks/useLanguage'
import { OrderData } from '../lib/types/order-history.types'
import { formatTimestamp } from '../utilities/confirm-utils'

const myLearningOrderHistory = () => {
  const [coursesOrders, setCoursesOrders] = useState<OrderData>([])
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
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {coursesOrders.map((courseOrder, index) => {
        console.log('courseOrder', courseOrder)
        const {
          attributes: { items, createdAt, order_id, delivery_status, quote },
          id
        } = courseOrder
        const { price } = quote
        return (
          <MyLearing
            key={index}
            heading={items[0].name}
            time={formatTimestamp(createdAt)}
            id={id}
            // TODO :- to check for price in this value
            price={price}
            myLearingStatus={delivery_status}
            handleViewCourses={() => {
              // TODO :- to check for the course URL in the catalogs
              // window.location.href = courseOrder.attributes.items[0].tags.Url
              window.location.href = 'https://www.google.com'
            }}
          />
        )
      })}
    </Box>
  )
}

export default myLearningOrderHistory
