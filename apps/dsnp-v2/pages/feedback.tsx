import { Box, Text, Image, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import StarRating from '../components/starRating/StarRating'
import { useLanguage } from '../hooks/useLanguage'
import feedbackImg from '../public/images/feedbackImg.svg'
import { Typography } from '@beckn-ui/molecules'
import { useSelector } from 'react-redux'
import { StatusRootState } from '@store/status-slice'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import { StatusResponseModel } from '../types/status.types'
import axios from 'axios'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { getLocalStorage } from '@utils/localstorage'

//dsnp importss
import { makeInteractionIdAndNonce } from '@utils/review'
import { DiscoveryRootState } from '@store/discovery-slice'
import { LocalStorage } from '@lib/types'

const createPost = async (
  formValues: ReviewProcessorValues,
  href: string,
  nonce: any,
  attributeSetType: string,
  interactionTicket: any,
  accessToken: string
) => {
  try {
    const body = new FormData()
    body.append('content', formValues.message)
    ;(formValues.images || []).forEach(upload => {
      if (upload.originFileObj) body.append('images', upload.originFileObj)
    })
    body.append(
      'tag',
      JSON.stringify([
        {
          type: 'Interaction',
          href,
          rel: attributeSetType,
          nonce,
          ticket: interactionTicket
        }
      ])
    )

    const resp = axios.request({
      url: `${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/v1/content/create`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: body
    })
    console.log('postActivityContentCreated', { resp })
    return resp
    //success();
  } catch (e) {
    throw Error(e)
  }
}

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isLoadingForRating, setIsLoadingForRating] = useState(false)
  const statusResponse = useSelector((state: StatusRootState) => state.status.statusResponse)
  const product = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const encodedProduct = useSelector((state: DiscoveryRootState) => state.discovery.encodedProduct)
  const { isDesktop } = useResponsive()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  //dsnp state

  const submitReviewToDsnp = async (
    review: string,
    productURL: string,
    productName: string,
    productImage: string,
    productDesc: string,
    id: string
  ) => {
    const dsnpAuth = getLocalStorage('dsnpAuth')
    const successUrl = `/product?productName=${productName}&productImage=${productImage}&reviewSubmitted=true`
    const errorUrl = `/product?productName=${productName}&productImage=${productImage}&reviewSubmitted=false`
    if (Object.keys(dsnpAuth).length !== 0) {
      const { accessToken, dsnpId } = dsnpAuth
      const { interactionId, nonce } = await makeInteractionIdAndNonce(dsnpId)
      const payloadForStatusRequest = getLocalStorage(LocalStorage.STATUSPAYLOAD)

      // if (localStorage) {
      //   const stringifiedConfirmData = localStorage.getItem('confirmData')

      //   if (stringifiedConfirmData) {
      //     const parsedConfirmedData = JSON.parse(stringifiedConfirmData)

      //     const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(parsedConfirmedData)

      //     payloadForStatusRequest = getPayloadForStatusRequest(
      //       confirmOrderMetaDataPerBpp,

      //       transactionId
      //     )
      //   }
      // }
      const reqBody = {
        // href: `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&productId=${id}&becknified=true`,
        href: `https://dsnp-stage.becknprotocol.io/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
        reference: {
          orderDetails: JSON.stringify(payloadForStatusRequest)
        },
        attributeSetType: 'dsnp://1#OndcProofOfPurchase',
        interactionId
      }
      setIsLoadingForRating(true)

      axios
        .request({
          url: `${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/v1/interactions`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          data: reqBody
        })
        .then(interactionResponse => {
          return createPost(
            {
              message: review,
              images: []
            },
            // `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
            `https://dsnp-stage.becknprotocol.io/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
            nonce,
            'dsnp://1#OndcProofOfPurchase',
            interactionResponse.data.ticket,
            accessToken
          )
        })
        .then(res => {
          router.push(successUrl)
        })
        .catch(err => {
          console.log('Error', err)
          router.push(errorUrl)
          setIsLoadingForRating(false)
        })
    }
  }

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
      // if (ratingResponse.data.data.length > 0) {
      //   router.push('/')
      // }
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
              handleClick={async () => {
                const productURL = typeof window !== 'undefined' && new URL(`${window.location.origin}/product`)
                productURL && productURL.searchParams.append('productDetails', encodedProduct)
                await submitReviewToDsnp(
                  feedback,
                  productURL.href,
                  product.item.name,
                  product.item.images[0].url,
                  product.item.long_desc,
                  product.item.id
                )

                handleSubmitReview(statusResponse)
              }}
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
