import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/button/Button'
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
    Router.push('/scholarshipCardPage')
  }

  const handleScholarshipDetails = () => {
    const id = '789171'
    const title = 'Extended Learning'
    dispatch(scholarshipCartActions.setScholarshipId(id))
    dispatch(scholarshipCartActions.setScholarshipTitle(title))
    Router.push('/cart')
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
