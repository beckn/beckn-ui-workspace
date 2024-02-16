import Image from 'next/image'
import React, { useState } from 'react'
import { RetailItem } from '../../lib/types/products'
import ProductPageActions from './ProductPageActions'

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
            width={350}
            height={230}
            className="object-contain md:drop-shadow-xl dark:bg-palette-card"
          />
        </div>
        <div>
          <h2
            className="text-palette-mute whitespace-normal border_radius_all"
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '20px',
              textAlign: 'center'
            }}
          >
            {product.descriptor.name}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default ImageSection
