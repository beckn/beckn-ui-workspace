import { Card, CardBody, Text, Box, Image } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { RetailItem, SanitizedProduct } from '../../lib/types/products'
import Button from '@components/button/Button'
import ImageSection from '../productDetails/ImageSection'
import DetailsSection from '@components/productDetails/DetailsSection'
import Loader from '../loader/Loader'

interface ProductPreviewProps {
  productName: string
  productImage: string
  productDesc: string
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ productImage, productName, productDesc }) => {
  const { t } = useLanguage()
  const [loader, setLoader] = useState(true)
  const handleShopbtn = (): void => {
    Router.push(`/homePage`)
  }

  const handleCheckReview = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/feed`
  }

  const sanitizedProduct: SanitizedProduct = {
    productDescription: productDesc,
    productName: productName,
    productImage: productImage
  }

  return (
    <div
      className="flex flex-col mt-4 hideScroll"
      style={{
        maxHeight: 'calc(100vh - 118px)',
        overflowY: 'scroll'
      }}
    >
      <div className="w-full xl:max-w-[2100px] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-start md:items-start relative">
          <ImageSection imgArray={[productImage]} />
          <DetailsSection
            sanitizedProduct={sanitizedProduct}
            isPreview={true}
          />
          <Button
            buttonText={t('shopBtn')}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
            isDisabled={false}
            handleOnClick={handleShopbtn}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductPreview
