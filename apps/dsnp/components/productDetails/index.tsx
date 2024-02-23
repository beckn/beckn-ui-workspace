import React, { useEffect, useState } from 'react'
import { RetailItem } from '../../lib/types/products'
import ImageSection from './ImageSection'
import DetailsSection from './DetailsSection'
import AvgReviews from '../UI/customerReviews/AvgReviews'
import CustomerReviews from '../UI/customerReviews/CustomerReviews'
import { useRouter } from 'next/router'
import { useLanguage } from '../../hooks/useLanguage'
import { Box, Button, Text } from '@chakra-ui/react'
import { CustomerReviewsProps } from '../UI/customerReviews/ReviewsMockData'
import custReviews from '../UI/customerReviews/ReviewsMockData'
import { getLocalStorage } from '@utils/localStorage'
import axios from 'axios'

interface Props {
  product: RetailItem
  feed: any
}

const getDsnpProfiles = async ids => {
  const { accessToken, dsnpId } = getLocalStorage('dsnpAuth')
  const idMap = new Map(ids.map(id => [id, '']))

  if (accessToken) {
    try {
      const responseList = await Promise.all(
        ids.map(singleId => {
          return axios.request({
            url: `https://api.dsnp-social-web.becknprotocol.io/v1/profiles/${singleId}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        })
      )
      responseList.forEach(singleProfile => {
        idMap.set(singleProfile.data.fromId, singleProfile.data.displayHandle)
      })
      return idMap
    } catch (err) {
      console.log('Error', err)
      throw Error(err)
    }
  }
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

const ProductDetails: React.FC<Props> = ({ product, feed }) => {
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false)
  const [dsnpUserMap, setDsnpUserMap] = useState({})
  const router = useRouter()

  useEffect(() => {
    if (Object.keys(dsnpUserMap).length === 0) {
      const ids = Array.from(
        new Set(
          feed.map(singleFeed => {
            return singleFeed.fromId
          })
        )
      )
      getDsnpProfiles(ids).then(profiles => setDsnpUserMap(profiles))
    }
  }, [feed])

  const { t } = useLanguage()

  const [avgRating, numOfReviewers] = calcAvgRating(custReviews)

  const reviewsToDisplay = showAllReviews ? custReviews : custReviews.slice(0, 2)

  const renderedReviews = feed.map((singleFeed, index) => {
    const content = JSON.parse(singleFeed.content)

    if (content.tag && content.tag.length > 0) {
      // NOTE - This boolean is to check whether the review belong to this product or not. This is not the recommended approach and only implemented for the POC
      const url = new URL(content.tag[0].href)
      const productName = url.searchParams.get('productName')
      const productId = url.searchParams.get('productId')
      const isProductReview = productId
        ? productId === product.id
        : productName
          ? productName === product.descriptor.name
          : false
      if (isProductReview)
        return (
          <CustomerReviews
            key={index}
            name={dsnpUserMap.get(singleFeed.fromId)}
            // rating={review.rating}
            // reviewHeading={review.reviewHeading}
            review={content.content}
            // foundHelpful={review.helpFul}
          />
        )
    }
  })
  return (
    <div
      className="flex flex-col mt-4 hideScroll"
      style={{
        maxHeight: 'calc(100vh - 118px)',
        overflowY: 'scroll'
      }}
    >
      <div className="w-full xl:max-w-[] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-start md:items-start relative">
          <ImageSection
            imgArray={product.descriptor.images}
            product={product}
          />
          <DetailsSection product={product} />
          {/* <AvgReviews avgRating={avgRating} numOfReviewers={numOfReviewers} /> */}
          <Box
            fontFamily={'Poppins'}
            p={'15px'}
            w={'100%'}
          >
            <Text
              fontSize={'17px'}
              fontWeight={600}
            >
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
          </Box>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
