import { Box, Text } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { RetailItem } from '../../../lib/types/products'
import Button from '../../button/Button'
import { ParsedScholarshipData } from '../scholarshipCard/Scholarship.types'

interface Props {
  scholarship: ParsedScholarshipData
}

const ScholarshipDetails: React.FC<Props> = ({ scholarship }) => {
  const { t } = useLanguage()
  return (
    <Box>
      <Text fontSize={'17px'} fontWeight="600" textAlign={'center'} pb="10px">
        {scholarship.name}
      </Text>
      <Text fontSize={'15px'} textAlign={'center'}>
        by {scholarship.platformName}
      </Text>
      <Box
        className="mt-4 product_description_text border-2 border_radius_all hideScroll"
        mb={'20px'}
        style={{
          padding: '5px 10px',
          maxHeight: 'calc(100vh - 254px)',
          overflow: 'auto'
        }}
      >
        {scholarship.description}
      </Box>
      <Button
        buttonText={t.applyNow}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={() => {
          Router.push('/applyScholarship')
        }}
      />
    </Box>
  )
}

export default ScholarshipDetails
