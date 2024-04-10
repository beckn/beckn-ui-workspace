import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ParsedItemModel } from '../../../types/search.types'

const scholarshipListCard = (props: any) => {
  const router = useRouter()
  const dataSource: ParsedItemModel = props.dataSource
  const {
    item: { name, long_desc },
    providerName
  } = dataSource

  return (
    <Box
      onClick={() => {
        localStorage.setItem('selectedScholarship', JSON.stringify(dataSource))
        router.push('/scholarshipDetailsPage')
      }}
    >
      <DetailCard>
        <Flex
          flexDir={'column'}
          gap={'10px'}
        >
          <Typography
            text={name}
            fontWeight={'600'}
          />
          <Typography text={long_desc} />

          <Typography
            text={`By: ${providerName}`}
            fontWeight={'600'}
          />
        </Flex>
      </DetailCard>
    </Box>
  )
}

export default scholarshipListCard
