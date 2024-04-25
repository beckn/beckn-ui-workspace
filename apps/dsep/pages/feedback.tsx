import { Box, Text, Image, Textarea, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import feedbackImg from '../public/images/feedbackImg.svg'
import { LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import axios from 'axios'
import { StatusResponseModel } from '../lib/types/status.types'
import { getFeedbackPayload } from '../utilities/feedback-utils'

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isLoadingForRating, setIsLoadingForRating] = useState(false)
  const [statusResponse, setStatusResponse] = useState<StatusResponseModel | null>(null)

  const { isDesktop } = useResponsive()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('statusResponse')) {
      setStatusResponse(JSON.parse(localStorage.getItem('statusResponse') as string))
    }
  }, [])

  const handleSubmitReview = async (statusData: StatusResponseModel) => {
    try {
      setIsLoadingForRating(true)

      const ratingPayload = getFeedbackPayload(statusData, ratingForStore)

      const ratingResponse = await axios.post(`${apiUrl}/rating`, ratingPayload)
      if (ratingResponse.data.data.length > 0) {
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!statusResponse || statusResponse.data.length === 0) {
    return <></>
  }

  if (isLoadingForRating) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 36px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.rateOrderLoaderSubText}
        />
      </Box>
    )
  }

  return (
    <Box
      marginTop={'27px'}
      className="hideScroll"
      maxH={'calc(100vh - 36px)'}
      overflowY="scroll"
      display={{ base: 'block', lg: 'flex' }}
      justifyContent="space-around"
      padding={{ base: '0 10px', lg: '3rem' }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        flexDir={'column'}
      >
        <Flex
          direction={'column'}
          alignItems={'center'}
          gap="2px"
          mb={'16px'}
        >
          <Text
            as={Typography}
            text={t.orderDeliveredOnTime}
            fontSize={'15px'}
            fontWeight={600}
          />
          <Text
            as={Typography}
            text={t.shareFeedbackText}
            fontSize={'12px'}
            fontWeight={400}
          />
        </Flex>
        <Image
          src={feedbackImg}
          margin={'0 auto'}
        />
      </Box>
      <Box>
        <Box
          pt={{ base: '2rem', lg: '0' }}
          textAlign={{ base: 'center', lg: 'left' }}
          pb={'15px'}
          display={{ base: 'block', lg: 'flex' }}
          flexDir="column"
          gap="1rem"
        >
          {isDesktop && (
            <Typography
              fontSize={{ base: '1rem', md: '2rem' }}
              variant="subTitleSemibold"
              text="Thank you for your order!"
            />
          )}

          <Text
            as={Typography}
            text={t.pleaseShareYourFeedback}
            fontSize={'12px'}
            fontWeight={400}
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
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            height={'124px'}
            resize={'none'}
            mb={'20px'}
            placeholder={t.writeExperience}
            boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
          />
          <Box
            width={'100%'}
            display={{ base: 'block', lg: 'flex' }}
            gap="1rem"
          >
            <BecknButton
              children="Submit Review"
              className="checkout_btn "
              disabled={!ratingForStore}
              handleClick={() => handleSubmitReview(statusResponse)}
            />
            <BecknButton
              children="Skip for Now"
              variant="outline"
              className="checkout_btn"
              handleClick={() => router.push('/')}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Feedback
