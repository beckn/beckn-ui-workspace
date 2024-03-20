import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import { ProductCardProps } from './product-card.types'
import ProductPrice from '../product-price'
import ProductRating from '../product-rating'

const ProductCard: React.FC<ProductCardProps> = props => {
  const { product, productInfoDataSource, ComponentRenderer, productClickHandler, dataSource, className = '' } = props

  if (ComponentRenderer) {
    return <ComponentRenderer dataSource={dataSource} />
  }
  return (
    <>
      {product ? (
        <Box
          className={`${className}-product_card_layout_container`}
          onClick={productClickHandler}
          minH={'168px'}
          width={['100%', '100%', '100%', 'calc(50% - 16px)']}
          m={['0 0 16px 0', '0 0 16px 0', '8px', '8px']}
          backgroundColor={'#fff'}
          borderRadius={'1rem'}
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
              borderBottomLeftRadius={'1rem'}
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
                  src={product.images[0]}
                  width={'110px'}
                  height={'133px'}
                  alt={'item_image'}
                  boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
                  objectFit={'contain'}
                />
              </Box>
            </Box>
            <Box
              p={'15px'}
              pt={'11px'}
              w={'66%'}
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
                  {product.name}
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
                <ProductPrice price={parseFloat(product.price)} />
                {product.rating && (
                  <ProductRating
                    ratingValue={product.rating}
                    ratingIcon={StarIcon}
                  />
                )}
              </Flex>
            </Box>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}

export default ProductCard
