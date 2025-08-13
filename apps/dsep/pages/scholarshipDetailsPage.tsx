import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ScholarshipDetails from '../components/scholarship/scholarshipDetails/ScholarshipDetails'
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
    >
      <ScholarshipDetails scholarship={selectedScholarship} />
    </Box>
  )
}

export default ScholarshipDetailsPage
