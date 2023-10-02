import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/button/Button'
import EmptyScholarship from '../components/scholarship/emptyScholarship/EmptyScholarship'
import ScholarshipCard from '../components/scholarship/scholarshipCard/ScholarshipCard'
import { useLanguage } from '../hooks/useLanguage'
import { RetailItem } from '../lib/types/products'
import { scholarshipCartProps } from '../lib/types/scholarshipCartProps'
import { scholarshipCartActions } from '../store/scholarshipCart-slice'

interface Props {
  product: RetailItem
}

const myScholarship: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const [scholarshipStatus, setScholarshipStatus] = useState('Approved')

  const dispatch = useDispatch()

  const handleScholarship = () => {
    Router.push('/scholarshipSearchPage')
  }

  const handleScholarshipDetails = () => {
    const mockScholarship = {
      id: '789171',
      title: 'Extended Learning'
    }

    localStorage.setItem('approvedScholarship', JSON.stringify(mockScholarship))

    dispatch(scholarshipCartActions.setScholarshipId(mockScholarship.id))
    dispatch(scholarshipCartActions.setScholarshipTitle(mockScholarship.title))
    Router.push('/cart')
  }

  if (false) {
    return <EmptyScholarship />
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <ScholarshipCard
        heading={'Extended Learning'}
        time={'21st Jun 2021, 3.30pm'}
        id={'789171'}
        scholarshipStatus={scholarshipStatus}
        addScholarshipCard={handleScholarshipDetails}
      />
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
