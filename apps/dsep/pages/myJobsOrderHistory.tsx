import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '../components/loader/Loader'
import MyJob from '../components/orderHistory/MyJob'
import { useLanguage } from '../hooks/useLanguage'
import { OrderData } from '../lib/types/order-history.types'
import { formatTimestamp } from '../utilities/confirm-utils'
import EmptyCartJob from './emptyCartJob'

const myJobsOrderHistory = () => {
  const [jobsOrders, setJobsOrders] = useState<OrderData>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const fetchJobsOrders = async () => {
    const bearerToken = Cookies.get('authToken')
    let myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    } as RequestInit

    fetch(`${apiUrl}/orders?filters[category]=3`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setJobsOrders(result.data)
        setIsLoading(false)
      })
      .catch(error => console.error('error', error))
  }

  useEffect(() => {
    fetchJobsOrders()
  }, [])

  if (isLoading) {
    return <Loader loadingText={t.fetchingJobs} />
  }

  if (!jobsOrders.length) {
    return <EmptyCartJob />
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {jobsOrders.map((jobOrder, index) => {
        const {
          attributes: { items, createdAt, delivery_status }
        } = jobOrder

        return (
          <MyJob
            key={index}
            heading={`${items[0].name} - ${jobOrder.attributes.descriptor.name} `}
            time={formatTimestamp(createdAt)}
            myJobsStatus={delivery_status}
            handleJobsStatus={() => {
              Router.push(`/applyJobsPrefilled?jobId=${jobOrder.id}`)
            }}
          />
        )
      })}
    </Box>
  )
}

export default myJobsOrderHistory
