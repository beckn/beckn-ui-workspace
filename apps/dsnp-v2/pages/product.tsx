import React, { useEffect, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import Confirmation from '@components/review/confirmation'
import { useDispatch, useSelector } from 'react-redux'
import { getLocalStorage } from '@utils/localstorage'
import { isEmpty } from '@utils/common-utils'
import CustomerReviews from '@components/UI/customerReviews/CustomerReviews'
import { Box } from '@chakra-ui/react'
import axios from '@services/axios'
import { cartActions, DiscoveryRootState, feedbackActions, ParsedItemModel } from '@beckn-ui/common'

const Product = () => {
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1)
  const [dsnpUserMap, setDsnpUserMap] = useState(new Map())
  const [totalPrice, setTotalPrice] = useState<number>(Number(selectedProduct.item.price.value))
  const url = new URL(window.location.href)
  const reviewSubmitted = url.searchParams.get('reviewSubmitted')
  const [feed, setFeed] = useState([])
  const productName = url.searchParams.get('productName')
  const productImage = url.searchParams.get('productImage')

  useEffect(() => {
    if (!isEmpty(selectedProduct)) setTotalPrice(selectedProduct.item.price.value)
  }, [selectedProduct])

  const getReviews = async () => {
    const { accessToken, dsnpId } = getLocalStorage('dsnpAuth')
    if (accessToken) {
      try {
        const response = await axios.request({
          url: `https://api.dsnp-social-web.becknprotocol.io/v1/content/discover`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        return response.data.posts
      } catch (err) {
        console.log('Error', err)
        throw Error(err)
      }
    }
  }
  useEffect(() => {
    getReviews().then(res => {
      setFeed(
        res.filter(singleFeed => {
          const content = JSON.parse(singleFeed.content)
          if (content.tag && content.tag.length > 0) {
            const url = new URL(content.tag[0].href)
            const productId = url.searchParams.get('productId')
            const productName = url.searchParams.get('productName')
            const isProductReview = selectedProduct.item.name === productName
            return isProductReview
          }
        })
      )
    })
  }, [])

  useEffect(() => {
    if (Object.keys(dsnpUserMap).length === 0 && !isEmpty(feed)) {
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

  const increment = () => {
    const newCounter = counter + 1
    const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
    setCounter(newCounter)
    setTotalPrice(newTotalPrice)
  }

  const decrement = () => {
    if (counter > 1) {
      const newCounter = counter - 1
      const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
      setCounter(newCounter)
      setTotalPrice(newTotalPrice)
    }
  }

  const renderedReviews = feed.map((singleFeed, index) => {
    const content = JSON.parse(singleFeed.content)
    const name = dsnpUserMap.get(singleFeed.fromId)
    return (
      <CustomerReviews
        key={index}
        name={name}
        // rating={review.rating}
        // reviewHeading={review.reviewHeading}
        review={content.content}
        // foundHelpful={review.helpFul}
      />
    )
  })

  if (!selectedProduct) {
    return <></>
  }
  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      {!isEmpty(reviewSubmitted) ? (
        <Confirmation
          reviewSubmitted={reviewSubmitted === 'true' ? true : false}
          productImage={productImage as string}
          productName={productName as string}
        />
      ) : (
        <>
          <ProductDetailPage
            schema={{
              productSummary: {
                imageSrc: selectedProduct.item.images[0].url!,
                name: selectedProduct.item.name,
                secondaryDescription: selectedProduct.item.long_desc,
                starRating: {
                  rating: selectedProduct.item.rating!,
                  size: 20,
                  setRating: () => {},
                  starCount: 5
                },
                productCta: {
                  currency: selectedProduct.item.price.currency,
                  totalPrice: selectedProduct.item.price.value,
                  handleIncrement: increment,
                  handleDecrement: decrement,
                  counter: counter,
                  cta: {
                    text: 'Add To Cart',
                    color: 'black',
                    handleClick: () => {
                      dispatch(
                        cartActions.addItemToCart({
                          product: selectedProduct,
                          quantity: counter
                        })
                      )
                      dispatch(
                        feedbackActions.setToastData({
                          toastData: {
                            message: 'Success',
                            display: true,
                            type: 'success',
                            description: 'Product added to cart'
                          }
                        })
                      )
                    }
                  }
                }
              }
            }}
          />
          <Box>{renderedReviews}</Box>
        </>
      )}
    </Box>
  )
}

export default Product
