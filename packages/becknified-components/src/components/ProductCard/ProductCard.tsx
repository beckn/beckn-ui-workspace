import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import { ProductCardProps } from './ProductCard.types'
import ProductPrice from '../productPrice'

const ProductCard: React.FC<ProductCardProps> = props => {
  const { product, productInfoDataSource, CustomInfoComponent, productClickHandler, className = '' } = props

  return (
    <>
      {CustomInfoComponent ? (
        <CustomInfoComponent product={product} />
      ) : (
        <Box
          onClick={productClickHandler}
          minH={'168px'}
          maxH={'100%'}
          className={`${className}_product_card col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-[#fff] rounded-xl flex relative`}
        >
          <div className="flex md:items-center md:flex-col relative w-full ">
            <Box
              w={'125px'}
              className=" md:w-full relative bg-slate-400/30  md:px-6  rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center"
            >
              <div className="flex items-center h-full  product-img-span">
                <Image
                  src={product.descriptor.images[0]}
                  width={'110px'}
                  height={'133px'}
                  alt={product.descriptor.name}
                  className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out "
                />
              </div>
            </Box>
            <Box
              p={'15px'}
              pt={'11px'}
              w={'63%'}
              position={'relative'}
              className="flex flex-col md:w-full md:px-3  md:py-4"
            >
              <Flex justifyContent={'space-between'} alignItems={'flex-start'} w={'100%'}>
                <Text
                  w={'80%'}
                  fontWeight={'600'}
                  fontSize={'15px'}
                  mb={'10px'}
                  noOfLines={2}
                  textOverflow="ellipsis"
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                >
                  {product.descriptor.name}
                </Text>
              </Flex>

              {productInfoDataSource &&
                Object.entries(productInfoDataSource).map(([key, value]) => (
                  <Flex fontSize="12px" alignItems="center" mb="8px" key={key}>
                    <Text fontWeight="600">{key}:</Text>
                    <Text
                      pl="3px"
                      noOfLines={1}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    >
                      {value}
                    </Text>
                  </Flex>
                ))}

              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                position={'absolute'}
                bottom={'11px'}
                width={'calc(100% - 30px)'}
              >
                <ProductPrice price={parseFloat(product.price.value)} />
                <Flex alignItems={'center'}>
                  <Image alt="star-icon" src={StarIcon} />
                  <Text fontSize={'12px'} pl={'5px'}>
                    {4.5}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </div>
        </Box>
      )}
    </>
  )
}

export default ProductCard
