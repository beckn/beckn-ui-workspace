import { Box, Flex, Image, Text } from '@chakra-ui/react'
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
    localStorage.removeItem('optionTags')
    localStorage.setItem('optionTags', JSON.stringify({ name: product.descriptor.name }))
    window.dispatchEvent(new Event('storage-optiontags'))
  }, [product])

  useEffect(() => {
    setShowComponent(true)
  }, [])

  if (!showComponent) {
    return <></>
  }

  return (
    <Box
      padding={'15px 15px'}
      className="bg-[#fff] md:bg-transparent  md:w-auto  flex-grow self-center lg:self-start md:mt-0  lg:ltr:ml-4 lg:rtl:mr-4 md:py-3.5 rounded-tl-xl rounded-tr-xl flex flex-col z-10"
    >
      <Flex justifyContent={'center'} alignItems={'center'} flexDirection="column">
        <h2
          className="text-palette-mute whitespace-normal border_radius_all"
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#000'
          }}
        >
          {product.descriptor.name}
        </h2>
      </Flex>
      <hr className="mt-1 hidden md:block" />
      <div className="flex items-start flex-wrap relative ">
        <div className="flex-grow ">
          <div
            dangerouslySetInnerHTML={{
              __html: product.descriptor.long_desc
            }}
            className="mt-4 product_description_text border-2 border_radius_all hideScroll"
            style={{
              padding: '15px 10px',
              maxHeight: '400px',
              overflow: 'auto'
            }}
          ></div>
        </div>
        <CallToAction product={product} />
      </div>
    </Box>
  )
}

export default DetailsSection
