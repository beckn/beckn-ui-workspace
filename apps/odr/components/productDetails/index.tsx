import React from 'react'
import DetailsSection from './DetailsSection'
import { ParsedScholarshipData } from '../productList/ProductList.utils'

interface Props {
  product: ParsedScholarshipData
}
const ProductDetails: React.FC<Props> = ({ product }) => {
  return (
    <div
      className="flex flex-col mt-4 hideScroll"
      style={{ maxHeight: 'Calc(100vh - 120px)', overflowY: 'scroll' }}
    >
      <div className="w-full xl:max-w-[2100px] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center md:items-start relative ">
          <DetailsSection product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
