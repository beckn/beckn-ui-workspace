import { Box, Text, Image, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import feedbackImg from '../public/images/feedbackImg.svg'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box
        pt={'27px'}
        textAlign={'center'}
        pb={'15px'}
      >
        <Text
          as={Typography}
          text={t.orderDeliveredOnTime}
          fontSize={'15px'}
          fontWeight={600}
        />
        <Text
          as={Typography}
          text={t.pleaseShareYourFeedback}
          fontSize={'12px'}
          fontWeight={400}
        />
      </Box>
      <Box mb={'10px'}>
        <Image
          src={feedbackImg}
          margin={'0 auto'}
        />
      </Box>
      <Box>
        <StarRating
          ratingText={t.rateDeliveryExperience}
          rating={ratingForStore}
          setRating={setRatingForStore}
          count={5}
          size={20}
          transition={''}
        />
        <Text
          as={Typography}
          text={t.addCommentsHere}
          fontSize={'15px'}
          fontWeight={400}
          mb={'10px'}
        />
        <Textarea
          height={'124px'}
          resize={'none'}
          mb={'20px'}
          placeholder={t.writeExperience}
          boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
        />
        <BecknButton
          children="Submit Review"
          className="checkout_btn "
          handleClick={() => router.push('/homePage')}
        />
        <BecknButton
          children="Skip for Now"
          variant="outline"
          className="checkout_btn"
          handleClick={() => router.push('/homePage')}
        />
      </Box>
    </Box>
  )
}

export default Feedback
