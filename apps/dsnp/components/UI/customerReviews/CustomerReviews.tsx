import React from 'react'
import { Box, Divider, Flex, HStack, Text } from '@chakra-ui/react'
import UserIcon from '../../../public/images/UserIcon.svg'
import Image from 'next/image'

import { useLanguage } from '../../../hooks/useLanguage'
import { renderStarsBasedOnRating } from '../../../utilities/customerReviews-utils'

interface ReviewProps {
  name: string
  rating?: number
  reviewHeading?: string
  review: string
  foundHelpful?: number
}

const CustomerReviews: React.FC<ReviewProps> = ({ name, rating, reviewHeading, review, foundHelpful }) => {
  const { t } = useLanguage()
  return (
    <Box
      fontFamily={'Poppins'}
      mt={'15px'}
      w={'100%'}
    >
      <Flex
        align={'center'}
        gap={'8px'}
      >
        <Box
          w={'36px'}
          h={'36px'}
          bgColor={'#D9D9D9'}
          borderRadius={'50%'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          overflow={'hidden'}
        >
          <Image
            src={UserIcon}
            width={24}
            height={24}
            alt="User Icon"
          />
        </Box>
        <Flex flexDirection={'column'}>
          <Text
            fontSize={'15px'}
            fontWeight={400}
          >
            {name && name.split('.')[0]} |{' '}
            <span
              style={{
                fontSize: '12px'
              }}
            >
              {' '}
              {t('verifiedPurchase')}
            </span>
          </Text>
          {/* <Flex gap={'9px'}>
            <HStack spacing={'none'}>{renderStarsBasedOnRating(rating)}</HStack>
            <Text
              fontSize={'11px'}
              fontWeight={400}
            >
              {rating} {rating > 1 ? 'Stars' : 'Star'}
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
      <Box mt={'12px'}>
        {/* <Text
          fontSize={'12px'}
          fontWeight={600}
          mb={'5px'}
        >
          {reviewHeading}
        </Text> */}
        <Text
          fontSize={'12px'}
          fontWeight={400}
          mb={'5px'}
        >
          {review}
        </Text>
        {/* <Text
          fontSize={'11px'}
          fontWeight={400}
          mb={'20px'}
        >
          {foundHelpful} {t('foundHelpfulText')}
        </Text> */}
      </Box>
      <Divider
        h={'1px'}
        bgColor={'#BFBFBF'}
        w={'100%'}
        p={'-15px'}
      />
    </Box>
  )
}

export default CustomerReviews
