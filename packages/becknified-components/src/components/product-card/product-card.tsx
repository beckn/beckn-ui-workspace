import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import { ProductCardProps } from './product-card.types'
import ProductPrice from '../productPrice'
import ProductRating from '../ProductRating'

const ProductCard: React.FC<ProductCardProps> = props => {
  const { product, productInfoDataSource, CustomInfoComponent, productClickHandler, className = '' } = props

  return (
    <>
      {CustomInfoComponent ? (
        <CustomInfoComponent product={product} />
      ) : (
        <Box
          className={`${className}-product_card_layout_container`}
          onClick={productClickHandler}
          minH={'168px'}
          width={'100%'}
          backgroundColor={'#fff'}
          borderRadius={'0.75rem'}
          display={'flex'}
          position={'relative'}
          boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
        >
          <Box
            display={'flex'}
            position={'relative'}
            width={'100%'}
          >
            <Box
              w={'125px'}
              position="relative"
              backgroundColor={'rgba(140, 158, 175, 0.3)'}
              borderTopLeftRadius={'1rem'}
              borderTopRightRadius={'1rem'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
                height={'100%'}
              >
                <Image
                  src={product.descriptor.images[0]}
                  width={'110px'}
                  height={'133px'}
                  alt={product.descriptor.name}
                  boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
                  objectFit={'contain'}
                />
              </Box>
            </Box>
            <Box
              p={'15px'}
              pt={'11px'}
              w={'63%'}
              position={'relative'}
              display={'flex'}
              flexDir={'column'}
            >
              <Flex
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                w={'100%'}
              >
                <Text
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
                  <Flex
                    fontSize="12px"
                    alignItems="center"
                    mb="8px"
                    key={key}
                  >
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
                <ProductRating
                  ratingValue="4.5"
                  ratingIcon={StarIcon}
                />
              </Flex>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default ProductCard
