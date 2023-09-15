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
    <div className="flex items-start rounded-lg w-full md:w-auto" style={{ marginBottom: '20px' }}>
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

        {/* TODO :- will uncomment it if we get multiple images in the array */}

        {/* <div className="flex mt-4  md:p-4 w-full max-w-[350px] overflow-auto">
          {imgArray.map((imgItem: string, index: number) => {
            return (
              <div
                key={index}
                className={`flex items-center justify-center p-2 md:p-4 rounded-lg  border-none transition-all duration-300 ease-in-out min-w-[80px] ${
                  index === selectedImg
                    ? "border-2 border-slate-300/60 shadow-md bg-palette-card/60"
                    : ""
                }`}
                onClick={() => onClickHandler(index)}
              >
                <Image
                  src={product.descriptor.images[0]}
                  width={70}
                  height={70}
                  alt="product img"
                  className="object-contain"
                />
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  )
}

export default ImageSection
