import { Box, Text, Flex, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Button from '@components/button/Button'
import { fromBinary } from '@utils/common-utils'
import StarRating from '@components/starRating/StarRating'
import { useLanguage } from '@hooks/useLanguage'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import { useSelector } from 'react-redux'
import ImageSection from '@components/productDetails/ImageSection'
import { IProductRootState, RetailItem } from '@lib/types/products'
import { getLocalStorage } from '@utils/localStorage'
import { toBinary } from '@utils/common-utils'

const getReviewLink = (review: string, productURL: string, productName: string, productImage: string) => {
  const myUrlWithParams = new URL(`${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/review`)

  const queryParameters = {
    href: productURL,
    // href: "https://www.etsy.com/listing/1292521772/melting-clock-salvador-dali-the",
    reference: {
      hello: 'world'
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

  const product = getLocalStorage('productDetails').product as RetailItem
  const encodedProduct = getLocalStorage('productDetails').encodedProduct as string

  const productURL = typeof window !== 'undefined' && new URL(`${window.location.origin}/product`)
  productURL && productURL.searchParams.append('productDetails', encodedProduct)

  if (!product) return <></>

  return (
    <>
      <Box pt={'12px'} pb={'15px'}>
        <Text fontSize={'15px'}>{t('selectProduct')}</Text>
        <Flex alignItems={'center'}>
          <Box height={'80px'} width="100px" className="review_image" margin={'0 auto'} mb={'10px'}>
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
        <Text fontSize={'15px'} fontWeight={400} mb={'10px'}>
          {t('addCommentsHere')}
        </Text>
        <Textarea
          onChange={e => setReview(e.target.value)}
          fontSize={'12px'}
          fontWeight={400}
          height={'124px'}
          resize={'none'}
          mb={'20px'}
          placeholder={t('writeExperience')}
          boxShadow={'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'}
        />
      </Box>
      <Button
        buttonText={t('submitReview')}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={() => {
          const user = localStorage.getItem('userPhone') as string
          localStorage.clear()
          localStorage.setItem('userPhone', user)
          if (window)
            window.location.href = getReviewLink(
              review,
              productURL.href,
              product.descriptor.name,
              product.descriptor.images[0]
            )
          // router.push(`/homePage`)
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
    </>
  )
}

export default Feedback
