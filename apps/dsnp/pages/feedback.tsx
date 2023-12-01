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
import { getLocalStorage } from '@utils/localStorage'
import { toBinary } from '@utils/common-utils'

const getReviewLink = (
  review: string,
  productURL: string,
  productName: string,
  productImage: string,
  productDesc: string,
  token: string
) => {
  const myUrlWithParams = new URL(`${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/review`)

  const queryParameters = {
    href: `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
    // href: `https://dsnp-stage.becknprotocol.io/product?productName=${productName}&productImage=${productImage}&productDesc=${productDesc}&becknified=true`,
    reference: {
      token
    },
    attributeSetType: 'dsnp://1#OndcProofOfPurchase',
    success_url: `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&reviewSubmitted=true`,
    error_url: `${window.location.origin}/product?productName=${productName}&productImage=${productImage}&reviewSubmitted=false`
  }

  const text = `⭐⭐⭐⭐⭐\n\n${review}`

  myUrlWithParams.searchParams.append('href', queryParameters.href)
  myUrlWithParams.searchParams.append('reference', JSON.stringify(queryParameters.reference))
  myUrlWithParams.searchParams.append('attributeSetType', queryParameters.attributeSetType)
  myUrlWithParams.searchParams.append('text', text)
  myUrlWithParams.searchParams.append('success_url', queryParameters.success_url)
  myUrlWithParams.searchParams.append('error_url', queryParameters.error_url)

  return myUrlWithParams.href
}

const Feedback = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [ratingForStore, setRatingForStore] = useState(0)
  const [review, setReview] = useState('')
  const [reviewValidationMessage, setReviewValidationMessage] = useState('')

  const product = getLocalStorage('productDetails').product as RetailItem
  const encodedProduct = getLocalStorage('productDetails').encodedProduct as string

  const getReviewToken = async () => {
    try {
      const response = await axios.request({
        url: `https://dsnp.becknprotocol.io/api/token`,
        method: 'POST'
      })
      return response.data.token
    } catch (err) {
      console.log('Error', err)
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
          localStorage.clear()
          localStorage.setItem('userPhone', user)
          getReviewToken().then(token => {
            if (window)
              window.location.href = getReviewLink(
                review,
                productURL.href,
                product.descriptor.name,
                product.descriptor.images[0],
                product.descriptor.long_desc,
                token
              )
          })
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
