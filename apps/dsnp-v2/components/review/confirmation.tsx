import { Card, CardBody, Text, Box, Image } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { RetailItem } from '../../lib/types/products'
import { Button } from '@beckn-ui/molecules'
import ImageSection from '../productDetails/ImageSection'
import { LoaderWithMessage } from '@beckn-ui/molecules'

interface ConfirmationProps {
  reviewSubmitted: boolean
  productName: string
  productImage: string
}

const Confirmation: React.FC<ConfirmationProps> = ({ reviewSubmitted, productImage, productName }) => {
  const message = reviewSubmitted ? 'Success' : 'Failure'

  const [loader, setLoader] = useState(true)

  const { t } = useLanguage()
  const handleShopbtn = (): void => {
    Router.push(`/`)
  }

  const handleCheckReview = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DSNP_SOCIAL_URL}/feed`
  }

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setLoader(false)
      }, 4000)
    }
  }, [loader])

  if (loader)
    return (
      <Box
        display="flex"
        height="calc(100vh - 160px)"
        justifyContent="center"
        alignItems={'center'}
      >
        <LoaderWithMessage
          loadingText={'Please wait!'}
          loadingSubText={'While we confirm your review is authentic for your order'}
        />
      </Box>
    )

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Card mb={'40px'}>
        <CardBody textAlign={'center'}>
          {message === 'Success' ? (
            <Image
              src="images/completed.svg"
              alt=""
              margin={'0 auto'}
              height="40px"
              mb="20px"
            />
          ) : (
            <Image
              src="images/cancelled.svg"
              alt=""
              margin={'0 auto'}
              height="40px"
              mb="20px"
            />
          )}
          <Text
            fontSize={'18px'}
            fontWeight="600"
          >
            {message === 'Success' ? 'Review Submitted!' : 'Failed!'}
          </Text>
          <Box
            width="100px"
            className="review_image"
            margin={'0 auto'}
            mt="10px"
          >
            <ImageSection imgArray={[productImage]} />
          </Box>
          <Text>{productName}</Text>
        </CardBody>
      </Card>
      <Button
        text={t['shopBtn']}
        handleClick={handleShopbtn}
      />
      <Button
        text={t['checkReview']}
        variant="outline"
        handleClick={handleCheckReview}
      />
    </Box>
  )
}

export default Confirmation
