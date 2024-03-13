import { Box, Text, Flex, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Button from '@components/button/Button'
import { fromBinary } from '@utils/common-utils'
import StarRating from '@components/starRating/StarRating'
import { useLanguage } from '@hooks/useLanguage'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import axios from 'axios'
import { useSelector } from 'react-redux'
import ImageSection from '@components/productDetails/ImageSection'
import { IProductRootState, RetailItem } from '@lib/types/products'
import { TransactionIdRootState } from '@lib/types/cart'
import { getLocalStorage } from '@utils/localStorage'
import { toBinary } from '@utils/common-utils'
import { getConfirmMetaDataForBpp, getPayloadForStatusRequest } from '@utils/confirm-utils'
import { makeInteractionIdAndNonce } from '@utils/review'

type ReviewProcessorValues = {
  message: string
  images: UploadFile[]
}

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
  const [review, setReview] = useState('')
  const [reviewValidationMessage, setReviewValidationMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

  const product = getLocalStorage('productDetails').product as RetailItem
  const encodedProduct = getLocalStorage('productDetails').encodedProduct as string

  const submitReview = async (
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
      let payloadForStatusRequest

      if (localStorage) {
        const stringifiedConfirmData = localStorage.getItem('confirmData')

        if (stringifiedConfirmData) {
          const parsedConfirmedData = JSON.parse(stringifiedConfirmData)

          const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(parsedConfirmedData)

          payloadForStatusRequest = getPayloadForStatusRequest(
            confirmOrderMetaDataPerBpp,

            transactionId
          )
        }
      }
      const reqBody = {
        href: `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&productId=${id}&becknified=true`,
        // href: `https://dsnp-stage.becknprotocol.io/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
        reference: {
          orderDetails: JSON.stringify(payloadForStatusRequest)
        },
        attributeSetType: 'dsnp://1#OndcProofOfPurchase',
        interactionId
      }
      setLoading(true)

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
            `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
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
          setLoading(false)
        })
    }
  }

  const handleReviewChange = (e: any) => {
    const text = e.target.value
    if (text.length <= 120) {
      setReview(text)
      setReviewValidationMessage('')
    } else {
      setReviewValidationMessage('Review should be within 120 letters.')
    }
  }

  const productURL = typeof window !== 'undefined' && new URL(`${window.location.origin}/product`)
  productURL && productURL.searchParams.append('productDetails', encodedProduct)

  if (!product) return <></>

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box
        pt={'12px'}
        pb={'15px'}
      >
        <Text fontSize={'15px'}>{t('selectProduct')}</Text>
        <Flex alignItems={'center'}>
          <Box
            width="100px"
            className="review_image"
            mr={'10px'}
            pt="20px"
          >
            <ImageSection imgArray={product.descriptor.images} />
          </Box>
          <Text>{product.descriptor.name}</Text>
        </Flex>
      </Box>

      <StarRating
        ratingText={t('ratetheproduct')}
        rating={ratingForStore}
        setRating={setRatingForStore}
        count={5}
        size={20}
        transition={''}
      />
      <Box mb={9}>
        <Text
          fontSize={'15px'}
          fontWeight={400}
          mb={'10px'}
        >
          {t('addCommentsHere')}
        </Text>
        <Textarea
          onChange={handleReviewChange}
          value={review}
          fontSize={'14px'}
          fontWeight={400}
          height={'124px'}
          resize={'none'}
          mb={'10px'}
          placeholder={t('writeExperience')}
          boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
        />
        <Text
          fontSize="12px"
          color="#F37A20"
        >
          {reviewValidationMessage}
        </Text>
      </Box>
      <Button
        buttonText={t('submitReview')}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={() => {
          const user = localStorage.getItem('userPhone') as string
          localStorage.setItem('userPhone', user)
          submitReview(
            review,
            productURL.href,
            product.descriptor.name,
            product.descriptor.images[0],
            product.descriptor.long_desc,
            product.id
          ) // localStorage.clear()
        }}
        isDisabled={false}
      />
      <Button
        buttonText={t('goBack')}
        background={'rgba(var(--text-color))'}
        color={'rgba(var(--color-primary))'}
        handleOnClick={() => {
          const user = localStorage.getItem('userPhone') as string
          localStorage.clear()
          localStorage.setItem('userPhone', user)
          router.push(`/homePage`)
        }}
        isDisabled={false}
      />
    </Box>
  )
}

export default Feedback
