import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '../components/loader/Loader'
import { ParsedScholarshipData } from '../components/scholarship/scholarshipCard/Scholarship.types'
import { getTransformedDataFromScholarshipsResponse } from '../components/scholarship/scholarshipCard/ScholarshipCard.utils'
import ScholarshipListCard from '../components/scholarship/scholarshipCard/scholarshipListCard'

const ScholarshipCard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [scholarShips, setScholarships] = useState<ParsedScholarshipData[]>([])
  const dsepScholarshipUrl = process.env.NEXT_PUBLIC_DSEP_URL

  const fetchScholarships = async () => {
    try {
      const scholarshipSearchResponse = await axios.post(`${dsepScholarshipUrl}/scholarship/search`, {
        name: 'scholarship'
      })
      if (scholarshipSearchResponse.data) {
        const parsedScholarshipData: ParsedScholarshipData[] = getTransformedDataFromScholarshipsResponse(
          scholarshipSearchResponse.data
        )
        setScholarships(parsedScholarshipData)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchScholarships()
  }, [])

  if (isLoading) {
    return <Loader loadingText="Searching for Scholarships" />
  }

  if (!scholarShips.length) {
    return <></>
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      {scholarShips.map(scholarship => (
        <ScholarshipListCard
          key={scholarship.id}
          scholarshipName={scholarship.name}
          scholarshipDetails={scholarship.description}
          scholarshipBy={scholarship.platformName}
          handleCardClick={() => {
            localStorage.setItem('selectedScholarship', JSON.stringify(scholarship))
            Router.push('/scholarshipDetailsPage')
          }}
        />
      ))}
    </Box>
  )
}

export default ScholarshipCard
