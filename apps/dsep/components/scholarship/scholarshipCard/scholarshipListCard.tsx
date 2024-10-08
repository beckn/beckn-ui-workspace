import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ParsedItemModel } from '../../../types/search.types'
import { testIds } from '@shared/dataTestIds'

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
      data-test={testIds.search_card_link}
    >
      <DetailCard>
        <Flex
          flexDir={'column'}
          gap={'10px'}
        >
          <Typography
            dataTest={testIds.search_card_Name}
            text={name}
            fontWeight={'600'}
          />
          <Typography
            text={long_desc}
            dataTest={testIds.search_Card_long_desc}
          />

          <Typography
            text={`By: ${providerName}`}
            fontWeight={'600'}
            dataTest={testIds.search_card_providerName}
          />
        </Flex>
      </DetailCard>
    </Box>
  )
}

export default scholarshipListCard
