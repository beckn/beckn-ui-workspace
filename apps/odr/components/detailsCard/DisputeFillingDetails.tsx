import React from 'react'
import { Flex, Image, Text, Stack, StackDivider } from '@chakra-ui/react'
import nameIcon from '../../public/images/attached.svg'
import DetailsCard from './DetailsCard'
import { useLanguage } from '../../hooks/useLanguage'

export interface DisputeBillingDetailsProps {
  accordionHeader: string
}
const DisputeFillingDetails: React.FC<DisputeBillingDetailsProps> = props => {
  const { t } = useLanguage()
  return (
    <DetailsCard>
      <Stack
        divider={<StackDivider />}
        spacing="4"
      >
        <Flex alignItems={'center'}>
          <Image
            src={nameIcon}
            pr={'12px'}
          />
          <Text fontSize={'15px'}>{t.disputeDetailsAdded}</Text>
        </Flex>
      </Stack>
    </DetailsCard>
  )
}

export default DisputeFillingDetails
