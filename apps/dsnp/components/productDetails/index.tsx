import React, { useState } from 'react'
import { RetailItem } from '../../lib/types/products'
import ImageSection from './ImageSection'
import DetailsSection from './DetailsSection'
import AvgReviews from '../UI/customerReviews/AvgReviews'
import CustomerReviews from '../UI/customerReviews/CustomerReviews'
import { useLanguage } from '../../hooks/useLanguage'
import { Box, Button, Text } from '@chakra-ui/react'
import { CustomerReviewsProps } from '../UI/customerReviews/ReviewsMockData'
import custReviews from '../UI/customerReviews/ReviewsMockData'

interface Props {
  product: RetailItem
}

export const calcAvgRating = (reviewsArray: CustomerReviewsProps[]): number[] => {
  let sumOfRatings = 0
  const numReviews = reviewsArray.length
  reviewsArray.forEach(review => {
    sumOfRatings += review.rating
  })
  const avgRating = sumOfRatings / numReviews
  return [avgRating, numReviews]
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false)

  const { t } = useLanguage()

  const [avgRating, numOfReviewers] = calcAvgRating(custReviews)

  const reviewsToDisplay = showAllReviews ? custReviews : custReviews.slice(0, 2)

  const renderedReviews = reviewsToDisplay.map((review, index) => {
    return (
      <CustomerReviews
        key={index}
        name={review.custName}
        rating={review.rating}
        reviewHeading={review.reviewHeading}
        review={review.reviewText}
        foundHelpful={review.helpFul}
      />
    )
  })
  return (
    <div className="flex flex-col mt-4 hideScroll" style={{ maxHeight: 'calc(100vh - 118px)', overflowY: 'scroll' }}>
      <div className="w-full xl:max-w-[2100px] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-start md:items-start relative">
          <ImageSection imgArray={product.descriptor.images} product={product} />
          <DetailsSection product={product} />
          {/* <AvgReviews avgRating={avgRating} numOfReviewers={numOfReviewers} /> */}
          {/* <Box fontFamily={'Poppins'} p={'15px'} w={'100%'}>
            <Text fontSize={'17px'} fontWeight={600}>
              {t('topReviews')}
            </Text>
            {renderedReviews}

            {custReviews.length > 2 && !showAllReviews && (
              <Button
                mt={'20px'}
                onClick={() => setShowAllReviews(true)}
                bgColor={'transparent'}
                p={'0px'}
                color="rgba(var(--color-primary))"
                fontSize={'15px'}
              >
                {t('seeMoreReviews')}
              </Button>
            )}
          </Box> */}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
