import { Box, Text, Image, Textarea, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import feedbackImg from '../public/images/feedbackImg.svg'
import { Typography } from '@beckn-ui/molecules'
import { useDispatch, useSelector } from 'react-redux'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import axios from '@services/axios'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { StatusRootState } from '@beckn-ui/common/src/store/status-slice'
import { StatusResponseModel } from '@beckn-ui/common/lib/types'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isLoadingForRating, setIsLoadingForRating] = useState(false)
  const statusResponse = useSelector((state: StatusRootState) => state.status.statusResponse)
  const { isDesktop } = useResponsive()
  const toast = useToast()
  const dispatch = useDispatch()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleSubmitReview = async (statusData: StatusResponseModel[]) => {
    try {
      setIsLoadingForRating(true)
      const { domain, bpp_id, bpp_uri, transaction_id } = statusData[0].context
      const orderId = statusData[0].message.order.id
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
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Success',
              display: true,
              type: 'success',
              description: 'Thank you for your rating! '
            }
          })
        )
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!statusResponse || statusResponse.length === 0) {
    return <></>
  }

  if (isLoadingForRating) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.rateOrderLoaderSubText}
        />
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      display={{ base: 'block', lg: 'flex' }}
      justifyContent="space-around"
      padding={{ base: '0 10px', lg: '3rem' }}
      // alignItems="center"
    >
      <Box mb={'10px'}>
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
          <Text
            as={Typography}
            text={t.orderDeliveredOnTime}
            fontSize={'15px'}
            fontWeight={600}
          />
          {isDesktop && (
            <Typography
              fontSize="1rem"
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
