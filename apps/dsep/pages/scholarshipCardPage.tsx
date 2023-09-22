import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import ScholarshipListCard from '../components/scholarship/scholarshipCard/scholarshipListCard'

const ScholarshipCard = () => {
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
