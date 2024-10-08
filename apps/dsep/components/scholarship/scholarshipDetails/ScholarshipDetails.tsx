import { Button, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { ParsedItemModel } from '../../../types/search.types'
import { testIds } from '@shared/dataTestIds'

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
          dataTest={testIds.scholarship_details_item_name}
        />
        <Typography
          text={`by ${scholarship.providerName}`}
          fontSize={'15px'}
          dataTest={testIds.scholarship_details_provider_name}
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
        data-test={testIds.scholarship_details_long_desc}
      >
        {scholarship.item.long_desc}
      </Box>
      <Button
        dataTest={testIds.scholarship_details_Button}
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
