import React, { useState } from 'react'
import { RetailItem } from '../../lib/types/products'
import ProductPageActions from './ProductPageActions'
import { Image } from '@chakra-ui/react'

interface Props {
  imgArray: string[]
  product: RetailItem
}
const ImageSection: React.FC<Props> = ({ imgArray, product }) => {
  const [selectedImg, setSelectedImg] = useState(0)
  function onClickHandler(index: number) {
    setSelectedImg(index)
  }
  return (
    <div
      className="flex items-start rounded-lg w-full md:w-auto"
      style={{ marginBottom: '20px' }}
    >
      <ProductPageActions product={product} />
      <div className="flex flex-col items-center w-full md:w-auto">
        <div className="flex flex-grow md:ltr:mr-3 md:rtl:ml-3 image_section">
          <Image
            src={product.descriptor.images[0]}
            alt="product img"
            width={'350px'}
            height={'230px'}
            className="object-contain md:drop-shadow-xl dark:bg-palette-card"
          />
        </div>
      </div>
    </div>
  )
}

export default ImageSection
