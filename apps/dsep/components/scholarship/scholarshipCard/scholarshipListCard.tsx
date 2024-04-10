import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import { ParsedItemModel } from '../../../types/search.types'

const scholarshipListCard = (props: any) => {
  const dataSource: ParsedItemModel = props.dataSource
  const {
    item: { name, long_desc },
    providerName
  } = dataSource

  return (
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
  )
}

export default scholarshipListCard
