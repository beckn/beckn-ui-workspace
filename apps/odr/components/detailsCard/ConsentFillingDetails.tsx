import React from 'react'
import { Flex, Image, Text, Stack, StackDivider } from '@chakra-ui/react'
import nameIcon from '../../public/images/attached.svg'
import DetailsCard from './DetailsCard'
import { useLanguage } from '../../hooks/useLanguage'

export interface ConsentBillingDetailsProps {
  accordionHeader: string
}
const ConsentFillingDetails: React.FC<ConsentBillingDetailsProps> = props => {
  const { t } = useLanguage()

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
          <Text fontSize={'15px'}>{t.consentformCompleted}</Text>
        </Flex>
      </Stack>
    </DetailsCard>
  )
}

export default ConsentFillingDetails
