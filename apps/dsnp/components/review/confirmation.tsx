import { Card, CardBody, Text, Box, Image } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { RetailItem } from '../../lib/types/products'
import Button from '../button/Button'
import ImageSection from '../productDetails/ImageSection'

interface ConfirmationProps {
  reviewSubmitted: boolean
  productName: string
  productImage: string
}

const Confirmation: React.FC<ConfirmationProps> = ({ reviewSubmitted, productImage, productName }) => {
  const message = reviewSubmitted ? 'Success' : 'Failure'

  const { t } = useLanguage()
  const handleShopbtn = (): void => {
    Router.push(`/homePage`)
  }

  const handleCheckReview = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/feed`
  }

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
        buttonText={t('shopBtn')}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleShopbtn}
      />
      <Button
        buttonText={t('checkReview')}
        color={'rgba(var(--color-primary))'}
        background={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleCheckReview}
      />
    </Box>
  )
}

export default Confirmation
