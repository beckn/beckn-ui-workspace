import { Box, Text, Image, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import feedbackImg from '../public/images/feedbackImg.svg'
import { Loader, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { ConfirmResponseModel } from '../types/confirm.types'
import axios from 'axios'

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[] | null>(null)
  const [isLoadingForRating, setIsLoadingForRating] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setConfirmData(parsedConfirmData)
    }
  }, [])

  const handleSubmitReview = async (confirmData: ConfirmResponseModel[]) => {
    try {
      setIsLoadingForRating(true)
      const { domain, bpp_id, bpp_uri, transaction_id } = confirmData[0].context
      const orderId = confirmData[0].message.orderId
      const ratingPayload = {
        data: [
          {
            context: {
              transaction_id,
              bpp_id,
              bpp_uri,
              domain
            },
            message: {
              id: orderId,
              rating_category: 'Order',
              value: ratingForStore
            }
          }
        ]
      }

      const ratingResponse = await axios.post(`${apiUrl}/rating`, ratingPayload)
      if (ratingResponse.data.data.length > 0) {
        router.push('/homePage')
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!confirmData || confirmData.length === 0) {
    return <></>
  }

  if (isLoadingForRating) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader>
          <Box
            mt={'13px'}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
          >
            <Text
              as={Typography}
              fontWeight={600}
              fontSize={'15px'}
              text={t.pleaseWait}
            />

            <Text
              as={Typography}
              text={t.rateOrderLoaderSubText}
              textAlign={'center'}
              alignSelf={'center'}
              fontWeight={400}
              fontSize={'15px'}
            />
          </Box>
        </Loader>
      </Box>
    )
  }

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
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          height={'124px'}
          resize={'none'}
          mb={'20px'}
          placeholder={t.writeExperience}
          boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
        />
        <BecknButton
          children="Submit Review"
          className="checkout_btn "
          disabled={!ratingForStore}
          handleClick={() => handleSubmitReview(confirmData)}
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
