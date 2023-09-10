import React from 'react'
import { RetailItem } from '../../lib/types/products'
import ImageSection from './ImageSection'
import DetailsSection from './DetailsSection'

interface Props {
  product: RetailItem
}
const ProductDetails: React.FC<Props> = ({ product }) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="w-full xl:max-w-[2100px] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center md:items-start relative">
          <ImageSection imgArray={product.descriptor.images} product={product} />
          <DetailsSection product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
