import { Card, CardBody, Text, Box, Image } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { RetailItem } from '../../lib/types/products'
import Button from '../button/Button'
import ImageSection from '../productDetails/ImageSection'

interface ConfirmationProps {
  reviewSubmitted: boolean
  product: RetailItem
}

const Confirmation: React.FC<ConfirmationProps> = ({ reviewSubmitted, product }) => {
  const message = reviewSubmitted ? 'Success' : 'Failure'

  const { t } = useLanguage()
  const handleShopbtn = (): void => {
    Router.push(`/homePage`)
  }

  return (
    <>
      <Card mb={'40px'}>
        <CardBody textAlign={'center'}>
          {message === 'Success' ? (
            <Image src="images/completed.svg" alt="" margin={'0 auto'} height="40px" mb="20px" />
          ) : (
            <Image src="images/cancelled.svg" alt="" margin={'0 auto'} height="40px" mb="20px" />
          )}
          <Text fontSize={'18px'} fontWeight="600">
            {message === 'Success' ? 'Review Submitted!' : 'Failed!'}
          </Text>
          <Box height={'80px'} width="100px" className="review_image" margin={'0 auto'} mb={'10px'}>
            <ImageSection imgArray={product.descriptor.images} product={product} />
          </Box>
          <Text>{product.descriptor.name}</Text>
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
        handleOnClick={handleShopbtn}
      />
    </>
  )
}

export default Confirmation
