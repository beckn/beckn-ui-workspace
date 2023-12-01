import React from 'react'
import { Flex, Image, Text, Stack, StackDivider, Box, CardBody } from '@chakra-ui/react'
import nameIcon from '../../public/images/attached.svg'
import DetailsCard from './DetailsCard'

export interface ConsentBillingDetailsProps {
  accordionHeader: string
}
const ConsentFillingDetails: React.FC<ConsentBillingDetailsProps> = props => {
  return (
    <DetailsCard>
      <Stack
        divider={<StackDivider />}
        spacing="4"
      >
        <Flex alignItems={'center'}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src={nameIcon}
            pr={'12px'}
          />
          <Text fontSize={'15px'}>Dispute details added</Text>
        </Flex>
      </Stack>
    </DetailsCard>
  )
}

export default ConsentFillingDetails
