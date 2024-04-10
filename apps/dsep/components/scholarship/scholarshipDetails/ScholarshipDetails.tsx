import { Button, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { ParsedItemModel } from '../../../types/search.types'

interface Props {
  scholarship: ParsedItemModel
}

const ScholarshipDetails: React.FC<Props> = ({ scholarship }) => {
  const { t } = useLanguage()
  return (
    <Box>
      <Flex
        flexDir={'column'}
        gap={'10px'}
        alignItems={'center'}
      >
        <Typography
          text={scholarship.item.name}
          fontSize={'17px'}
          fontWeight={'600'}
        />
        <Typography
          text={`by ${scholarship.providerName}`}
          fontSize={'15px'}
        />
      </Flex>
      <Box
        className="mt-4 product_description_text border-2 border_radius_all hideScroll"
        mb={'20px'}
        style={{
          padding: '5px 10px',
          maxHeight: 'calc(100vh - 254px)',
          overflow: 'auto'
        }}
      >
        {scholarship.item.long_desc}
      </Box>
      <Button
        text={t.applyNow}
        color={'rgba(var(--text-color))'}
        disabled={false}
        handleClick={() => {
          Router.push('/applyScholarship')
        }}
      />
    </Box>
  )
}

export default ScholarshipDetails
