import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Flex, Image, Text, useTheme } from '@chakra-ui/react'
import React, { FC } from 'react'

interface RateUsCardPropsModel {
  header: string
  subHeader: string
  rateText: string
  handleRateClick: () => void
}

const RateUsCard: FC<RateUsCardPropsModel> = ({ header, subHeader, rateText, handleRateClick }) => {
  const theme = useTheme()
  const color = theme.colors.primary[100]
  return (
    <DetailCard>
      <Flex
        alignItems="center"
        pb="3px"
      >
        <Image
          width="20px"
          height="20px"
          src="/images/TrackIcon.svg"
        />
        <Text
          as={Typography}
          text={header}
          pl="8px"
          fontSize="17px"
          fontWeight="600"
        />
      </Flex>
      <Flex
        alignItems="center"
        fontSize="15px"
        pl="20px"
      >
        <Text
          pl="8px"
          as={Typography}
          text={subHeader}
        />
        <Text
          onClick={handleRateClick}
          pl="10px"
          color={color}
          as={Typography}
          text={rateText}
          fontWeight={500}
        />
      </Flex>
    </DetailCard>
  )
}

export default RateUsCard
