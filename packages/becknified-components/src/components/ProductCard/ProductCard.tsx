import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import { ProductCardProps } from './ProductCard.types'
import ProductPrice from '../productPrice'
import Styles from './product-card.module.css'

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
          className={`${Styles.product_card_layout_container} ${className}_product_card `}
        >
          <div className={Styles.product_card_container}>
            <Box
              w={'125px'}
              className={Styles.product_img_lay_cont}
            >
              <div className={Styles.product_img_cont}>
                <Image
                  src={product.descriptor.images[0]}
                  width={'110px'}
                  height={'133px'}
                  alt={product.descriptor.name}
                  className={Styles.product_img}
                />
              </div>
            </Box>
            <Box
              p={'15px'}
              pt={'11px'}
              w={'63%'}
              position={'relative'}
              className={Styles.product_name_container}
            >
              <Flex
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                w={'100%'}
              >
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
                <Flex alignItems={'center'}>
                  <Image
                    alt="star-icon"
                    src={StarIcon}
                  />
                  <Text
                    fontSize={'12px'}
                    pl={'5px'}
                  >
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
