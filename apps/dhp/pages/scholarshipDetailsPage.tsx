import { Box } from '@chakra-ui/react'
import React from 'react'
import ScholarshipDetails from '../components/scholarship/scholarshipDetails/ScholarshipDetails'
import { RetailItem } from '../lib/types/products'

interface Props {
  product: RetailItem
}

const ScholarshipDetailsPage: React.FC<Props> = ({ product }) => {
  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <ScholarshipDetails product={product} />
    </Box>
  )
}

export default ScholarshipDetailsPage
