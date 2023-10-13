import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/button/Button'
import Loader from '../components/loader/Loader'
import EmptyScholarship from '../components/scholarship/emptyScholarship/EmptyScholarship'
import ScholarshipCard from '../components/scholarship/scholarshipCard/ScholarshipCard'
import { useLanguage } from '../hooks/useLanguage'

import { scholarshipCartActions } from '../store/scholarshipCart-slice'
import { getOrderPlacementTimeline } from '../utilities/confirm-utils'

const myScholarship = () => {
  const { t } = useLanguage()
  const [scholarshipOrders, setScholarshipOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const router = useRouter()

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const handleScholarship = () => {
    router.push('/scholarshipSearchPage')
  }

  const fetchScholarshipOrders = async () => {
    const bearerToken = Cookies.get('authToken')
    let myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    } as RequestInit

    fetch(`${apiUrl}/orders?filters[category]=2`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setScholarshipOrders(result.data)
        setIsLoading(false)
      })
      .catch(error => console.error('error', error))
  }

  useEffect(() => {
    fetchScholarshipOrders()
  }, [])

  const handleScholarshipDetails = (scholarshipOrder: any) => {
    const mockScholarship = {
      id: scholarshipOrder.attributes.items[0].id,
      title: scholarshipOrder.attributes.items[0].descriptor.name
    }

    localStorage.setItem('approvedScholarship', JSON.stringify(mockScholarship))

    dispatch(scholarshipCartActions.setScholarshipId(mockScholarship.id))
    dispatch(scholarshipCartActions.setScholarshipTitle(mockScholarship.title))
    router.push('/cart')
  }

  if (isLoading) {
    return <Loader loadingText={t.fetchingScholarships} />
  }

  if (!scholarshipOrders.length) {
    return <EmptyScholarship />
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      {scholarshipOrders.map((scholarshipOrder: any, index) => (
        <ScholarshipCard
          key={index}
          heading={scholarshipOrder.attributes.items[0].descriptor.name}
          time={getOrderPlacementTimeline(scholarshipOrder.attributes.createdAt)}
          id={scholarshipOrder.attributes.items[0].id}
          scholarshipStatus={scholarshipOrder.attributes.delivery_status}
          addScholarshipCard={() => handleScholarshipDetails(scholarshipOrder)}
        />
      ))}

      <Button
        buttonText={t.searchMoreScholarships}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleScholarship}
      />
    </Box>
  )
}

export default myScholarship
