import { Box, Text } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '../components/loader/Loader'
import ProductDetails from '../components/productDetails'
import {
  getTransformDataForSelectFromSelectRespnse,
  ParsedScholarshipData
} from '../components/productList/ProductList.utils'
import { fromBinary } from '../utilities/common-utils'
import { useLanguage } from '../hooks/useLanguage'

const Product = () => {
  const [selectedProduct, setSelectedProduct] = useState<ParsedScholarshipData | null>(null)
  const [product, setProduct] = useState<ParsedScholarshipData | null>(null)
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string
  const [isLoading, setIsLoadig] = useState<boolean>(true)

  useEffect(() => {
    const { productDetails } = router.query

    if (productDetails) {
      setSelectedProduct(JSON.parse(fromBinary(window.atob(productDetails as string))))
    }
  }, [router.isReady])

  useEffect(() => {
    if (selectedProduct) {
      const { transactionId, bppId, bppUri, id, providerId } = selectedProduct
      axios
        .post(`${apiUrl}/select`, {
          scholarshipProviderId: providerId,
          scholarshipId: id,
          context: {
            transactionId,
            bppId,
            bppUri
          }
        })
        .then(res => {
          const selectResponse = res.data
          localStorage.setItem('quoteResponse', JSON.stringify(selectResponse))
          setProduct(getTransformDataForSelectFromSelectRespnse(selectResponse))
          setIsLoadig(false)
        })
        .catch(err => console.error(err))
    }
  }, [selectedProduct])

  if (isLoading) {
    return (
      <Loader>
        <Box
          mt={'13px'}
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}
        >
          <Text fontWeight={700}>{t.categoryLoadPrimary}</Text>
          <Text>{t.fetchingDetails}</Text>
          <Text>{t.ofOdrService}</Text>
        </Box>
      </Loader>
    )
  }

  if (!selectedProduct || !product) {
    return <></>
  }

  return <ProductDetails product={product} />
}

export default Product
