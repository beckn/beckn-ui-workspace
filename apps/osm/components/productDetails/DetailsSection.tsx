import { Box, Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import { useLanguage } from '../../hooks/useLanguage'
import { RetailItem } from '../../lib/types/products'
import CallToAction from './CallToAction'
import greenVegIcon from '../../public/images/greenVeg.svg'
import redNonVegIcon from '../../public/images/redNonVeg.svg'

interface Props {
  product: RetailItem
}
const DetailsSection: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const [showComponent, setShowComponent] = useState(false)

  useEffect(() => {
    setShowComponent(true)
  }, [])

  if (!showComponent) {
    return <></>
  }

  return (
    <Box
      filter={'drop-shadow(0px 20px 25px rgba(0, 0, 0, 0.10)) drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.10))'}
      padding={'15px 20px'}
      className="bg-[#fff] md:bg-transparent  md:w-auto  flex-grow self-center lg:self-start md:mt-0  lg:ltr:ml-4 lg:rtl:mr-4 md:py-0 rounded-tl-xl rounded-tr-xl flex flex-col z-10"
    >
      <Flex justifyContent={'space-between'} alignItems={'flex-start'}>
        <h2
          className="text-palette-mute whitespace-normal border_radius_all"
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#000',
            marginBottom: '20px'
          }}
        >
          {product.descriptor.name}
        </h2>

        {product.tags.foodType ? (
          product.tags.foodType === 'veg' ? (
            <Image pt={'4px'} src={greenVegIcon} alt="greenVegIcon" />
          ) : (
            <Image pt={'4px'} src={redNonVegIcon} alt="redNonVegIcon" />
          )
        ) : null}
      </Flex>
      <hr className="mt-1 hidden md:block" />
      <div className="flex items-start flex-wrap relative">
        <div className="flex-grow">
          <div className="flex items-center self-center">
            <StarRatingComponent name="product_rate" starCount={5} value={parseFloat(product.tags.rating)} />
            <p className="text-sm text-palette-mute rtl:mr-2 ltr:ml-2 pl-1">
              {parseFloat(product.tags.rating)} {t.stars}
            </p>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: product.descriptor.long_desc
            }}
            className="mt-4 product_description_text"
          ></div>
        </div>
        <CallToAction product={product} />
      </div>
    </Box>
  )
}

export default DetailsSection
