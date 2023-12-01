import React from 'react'
import { Box, Text, Flex, Divider, HStack } from '@chakra-ui/react'

import { useLanguage } from '../../../hooks/useLanguage'

import { renderStarsBasedOnRating } from '../../../utilities/customerReviews-utils'
interface AvgReviewProps {
  avgRating: number
  numOfReviewers: number
}

const AvgReviews: React.FC<AvgReviewProps> = ({ avgRating, numOfReviewers }) => {
  const { t } = useLanguage()
  return (
    <Box
      p={'15px'}
      fontFamily={'Poppins'}
      w={'100%'}
    >
      <Text
        fontSize={'17px'}
        fontWeight={600}
        align={'left'}
        mb={'5px'}
      >
        {t('customerReviews')}
      </Text>
      <Flex
        align={'center'}
        gap={'9px'}
      >
        <HStack spacing={'none'}>{renderStarsBasedOnRating(avgRating)}</HStack>
        <Text
          fontSize={'11px'}
          fontWeight={400}
        >
          {avgRating} Stars
        </Text>
      </Flex>
      <Text
        fontSize={'12px'}
        fontWeight={400}
        mt={'10px'}
        mb={'20px'}
      >
        {numOfReviewers} {t('verifiedUsersText')}
      </Text>
      <Divider
        h={'1px'}
        bg={'#BFBFBF'}
      />
    </Box>
  )
}

export default AvgReviews
