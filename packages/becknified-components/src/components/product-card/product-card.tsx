import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import { ProductCardProps } from './product-card.types'
import ProductPrice from '../product-price'
import ProductRating from '../product-rating'

const ProductCard: React.FC<ProductCardProps> = props => {
  const {
    product,
    productInfoDataSource,
    ComponentRenderer,
    productClickHandler,
    dataSource,
    className = '',
    currency
  } = props

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
          cursor="pointer"
          _hover={{
            transform: ['none', 'none', 'translate(2%,-2%)']
          }}
          transition="0.5s all"
          position={'relative'}
          boxShadow={'0px 8px 10px 0px #0000001A'}
        >
          <Box
            display={'flex'}
            position={'relative'}
            width={'100%'}
          >
            <Box
              w={'125px'}
              position="relative"
              borderTopLeftRadius={'1rem'}
              borderBottomLeftRadius={'1rem'}
              overflow={'hidden'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'space-between'}
              alignItems={'center'}
              marginRight="0.7rem"
            >
              <Box
                display={'flex'}
                alignItems={'center'}
                height={'100%'}
              >
                <Image
                  src={product.images[0]}
                  width={'100%'}
                  height={'100%'}
                  alt={'item_image'}
                  boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
                  objectFit={'cover'}
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
                  fontSize={'1rem'}
                  mb={'0.7rem'}
                  noOfLines={2}
                  textOverflow="ellipsis"
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                >
                  {product.name}
                </Text>
              </Flex>
              {product.source ? (
                <Flex
                  alignItems={'flex-start'}
                  w={'100%'}
                >
                  <Text
                    fontSize={'0.8rem'}
                    mb={'0.7rem'}
                    fontWeight={'600'}
                    mr="5px"
                  >
                    {product.source} :
                  </Text>
                  <Text
                    fontSize={'0.8rem'}
                    mb={'0.7rem'}
                    w={['60%', '60%', 'unset']}
                    noOfLines={2}
                    textOverflow="ellipsis"
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                  >
                    {product.sourceText}
                  </Text>
                </Flex>
              ) : (
                product.sourceText && (
                  <Text
                    fontSize={'0.8rem'}
                    mb={'0.7rem'}
                    noOfLines={2}
                    textOverflow="ellipsis"
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                  >
                    {product.sourceText}
                  </Text>
                )
              )}

              <Flex
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                w={'100%'}
              >
                <Text
                  fontSize={'0.8rem'}
                  mb={'0.7rem'}
                  noOfLines={2}
                  textOverflow="ellipsis"
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                >
                  {product.shortDesc}
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
                <ProductPrice
                  currencyType={currency}
                  price={parseFloat(product.price)}
                />
                {product.rating && product.rating !== 'null' && (
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
