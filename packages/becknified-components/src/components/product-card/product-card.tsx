import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import { ProductCardProps } from './product-card.types'
import ProductPrice from '../product-price'
import ProductRating from '../product-rating'
import guideImage from '../images/GUIDE.svg'

const ProductCard: React.FC<ProductCardProps> = props => {
  const {
    product,
    productInfoDataSource,
    ComponentRenderer,
    productClickHandler,
    dataSource,
    className = '',
    currency,
    dataTest = 'products',
    renderMode = 'short'
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
          // minH={'168px'}
          width={['100%', '100%', '100%', `${renderMode === 'short' ? 'calc(50% - 16px)' : '100%'}`]}
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
          data-test={dataTest}
        >
          {/* {props.product?.guideImage && <Image src={props.product?.guideImage} />} */}
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
              margin="0.7rem"
            >
              <Box
                display={'flex'}
                alignItems={'center'}
                height={'100%'}
              >
                <Image
                  src={product.images?.[0]}
                  width={'100%'}
                  height={'100%'}
                  alt={'item_image'}
                  boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
                  objectFit={'cover'}
                  className="product-search-img"
                />
              </Box>
            </Box>
            <Flex
              flexDirection={'column'}
              justifyContent={'space-between'}
              width={'100%'}
              p={'15px'}
              pt={'10px'}
            >
              <Box
                w={'100%'}
                position={'relative'}
                display={'flex'}
                flexDir={'column'}
              >
                {product.name && (
                  <Flex
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    w={'100%'}
                  >
                    <Text
                      fontWeight={'600'}
                      fontSize={'1rem'}
                      mb="10px"
                      noOfLines={2}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    >
                      {product.name}
                    </Text>
                    {product.infoGuideIcon && <Image src={guideImage} />}
                  </Flex>
                )}
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                  w={'100%'}
                >
                  {product.shortDesc && (
                    <Text
                      fontSize={'0.8rem'}
                      mb="10px"
                      noOfLines={2}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    >
                      {product.shortDesc}
                    </Text>
                  )}
                </Flex>
                {product.source && product.sourceText ? (
                  <Flex
                    alignItems={'flex-start'}
                    w={'100%'}
                  >
                    <Text
                      fontSize={'0.8rem'}
                      mb="10px"
                      fontWeight={'600'}
                      mr="5px"
                      flex={'none'}
                    >
                      {product.source} :
                    </Text>
                    <Text
                      fontSize={'0.8rem'}
                      mb="10px"
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
                      mb="10px"
                      noOfLines={2}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    >
                      {product.sourceText}
                    </Text>
                  )
                )}

                {productInfoDataSource && typeof productInfoDataSource === 'string' && (
                  <Flex
                    fontSize="12px"
                    alignItems="center"
                    mb="10px"
                  >
                    <Text
                      pl="3px"
                      noOfLines={1}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    >
                      {productInfoDataSource as string}
                    </Text>
                  </Flex>
                )}
                {productInfoDataSource && (
                  <>
                    {typeof productInfoDataSource === 'object' && (
                      <>
                        {Object.keys(productInfoDataSource).includes('image') ? (
                          <Image
                            w={'60px'}
                            mt="5px"
                            src={productInfoDataSource['image']}
                          />
                        ) : (
                          <>
                            {Object.entries(productInfoDataSource as Record<string, any>).map(([key, value]) => (
                              <Flex
                                fontSize="12px"
                                alignItems="center"
                                mb="10px"
                                key={key}
                                className="custom-product-info"
                              >
                                <Text
                                  fontWeight="600"
                                  whiteSpace={'nowrap'}
                                  minW="fit-content"
                                >
                                  {key}:
                                </Text>
                                <Text
                                  pl="3px"
                                  noOfLines={2}
                                  textOverflow="ellipsis"
                                  whiteSpace="pre-wrap"
                                  overflowWrap="break-word"
                                >
                                  {value}
                                </Text>
                              </Flex>
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                // position={'absolute'}
                // bottom={'10px'}
                // width={'calc(100% - 12px)'}
              >
                <ProductPrice
                  currencyType={currency}
                  price={parseFloat(product.price)}
                  rateLabel={product.rateLabel}
                  className="product-price"
                />
                {product.rating && product.rating !== 'null' && (
                  <ProductRating
                    ratingValue={product.rating}
                    ratingIcon={StarIcon}
                    className="product-star-rating"
                  />
                )}
              </Flex>
            </Flex>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}

export default ProductCard
