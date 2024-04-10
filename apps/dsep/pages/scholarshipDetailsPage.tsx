import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ParsedScholarshipData } from '../components/scholarship/scholarshipCard/Scholarship.types'
import ScholarshipDetails from '../components/scholarship/scholarshipDetails/ScholarshipDetails'
import { RetailItem } from '../lib/types/products'
import { ParsedItemModel } from '../types/search.types'

const ScholarshipDetailsPage = () => {
  const [selectedScholarship, setSelectedScholarship] = useState<ParsedItemModel | null>(null)

  useEffect(() => {
    if (localStorage) {
      const storedSelectedScholarship = localStorage.getItem('selectedScholarship')
      if (storedSelectedScholarship) {
        setSelectedScholarship(JSON.parse(storedSelectedScholarship))
      }
    }
  }, [])

  if (!selectedScholarship) {
    return <></>
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <ScholarshipDetails scholarship={selectedScholarship} />
    </Box>
  )
}

export default ScholarshipDetailsPage
