import { Button } from '@beckn-ui/molecules'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Attributes, OrderData } from '../lib/types/order-history.types'
import EmptyScholarship from '../components/scholarship/emptyScholarship/EmptyScholarship'
import ScholarshipCard from '../components/scholarship/scholarshipCard/ScholarshipCard'
import { useLanguage } from '../hooks/useLanguage'
import { scholarshipCartActions } from '../store/scholarshipCart-slice'
import { formatTimestamp } from '../utilities/confirm-utils'
import { testIds } from '@shared/dataTestIds'

const myScholarship = () => {
  const { t } = useLanguage()
  const [scholarshipOrders, setScholarshipOrders] = useState<OrderData>([])
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

    fetch(`${apiUrl}/orders?filters[category]=2&sort[0]=updatedAt:desc`, requestOptions)
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

  const handleScholarshipDetails = (scholarshipOrder: Attributes) => {
    const {
      attributes: { items },
      id
    } = scholarshipOrder
    const mockScholarship = {
      id,
      title: items[0].name
    }

    localStorage.setItem('approvedScholarship', JSON.stringify(mockScholarship))

    dispatch(scholarshipCartActions.setScholarshipId(mockScholarship.id))
    dispatch(scholarshipCartActions.setScholarshipTitle(mockScholarship.title))
    router.push('/cart')
  }

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.fetchingScholarships}
        />
      </Box>
    )
  }

  if (!scholarshipOrders.length) {
    return <EmptyScholarship />
  }

  console.log(scholarshipOrders)

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {scholarshipOrders.map((scholarshipOrder, index) => {
        const {
          attributes: { items, createdAt, order_id, delivery_status },
          id
        } = scholarshipOrder
        return (
          <ScholarshipCard
            key={index}
            heading={items[0].name}
            time={formatTimestamp(createdAt)}
            id={id}
            scholarshipStatus={delivery_status}
            addScholarshipCard={() => handleScholarshipDetails(scholarshipOrder)}
          />
        )
      })}

      <Button
        dataTest={testIds.scholarshipCardButton}
        text={t.searchMoreScholarships}
        color={'rgba(var(--text-color))'}
        disabled={false}
        handleClick={handleScholarship}
      />
    </Box>
  )
}

export default myScholarship
