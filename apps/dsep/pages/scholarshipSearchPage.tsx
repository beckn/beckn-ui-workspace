import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import ScholarshipListCard from '../components/scholarship/scholarshipCard/scholarshipListCard'

const ScholarshipCard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dsepScholarshipUrl = process.env.NEXT_PUBLIC_SCHOLARSHIP_URL

  const fetchScholarships = async () => {
    try {
      const scholarshipSearchResponse = await axios.post(`${dsepScholarshipUrl}/scholarship/search`, {
        name: 'Undergraduation scholarship',
        gender: 'Female',
        finStatus: {
          family_income: '200000'
        },
        casteCategory: [
          {
            caste: 'SC'
          }
        ],
        categories: [
          {
            code: 'ug'
          }
        ]
      })
      console.log('scholarshipSearchResponse', scholarshipSearchResponse)
    } catch (error) {}
  }

  useEffect(() => {
    fetchScholarships()
  }, [])

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <ScholarshipListCard
        scholarshipName={'Scholarship Name Placeholder Text'}
        scholarshipDetails={'Extended learning scholarship for design placeholder description text for very brief...'}
        scholarshipBy={'ShopNotch'}
        handleCardClick={() => {
          Router.push('/scholarshipDetailsPage')
        }}
      />
    </Box>
  )
}

export default ScholarshipCard
