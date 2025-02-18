import { Typography, Button } from '@beckn-ui/molecules'
import { ProductPrice, StarRating } from '@beckn-ui/becknified-components'
import { Box, Image, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { ProductSummaryPropsModel } from './product-summary.types'
import ProductDescription from '../prouct-description'
import ProductCTA from '../product-Cta'
import { testIds } from '@shared/dataTestIds'

const ProductSummary: React.FC<ProductSummaryPropsModel> = props => {
  const {
    imageSrc,
    name,
    domain,
    providerName,
    itemForRenderer,
    ProductSummaryRenderer,
    className = '',
    secondaryCTAs,
    secondaryDescription,
    starRating,
    productCta,
    dataTestTitle = 'item-title',
    dataTestDescription = 'item-description',
    showPriceInSummary = false
  } = props

  return (
    <>
      {ProductSummaryRenderer ? (
        <ProductSummaryRenderer item={itemForRenderer} />
      ) : (
        <Box
          display={'flex'}
          width={'100%'}
          mb={'20px'}
          mt={{ base: '2rem', xl: '5rem' }}
          data-testid="test-product-summary"
          className={`${className}-product_summary_container`}
        >
          <Flex
            gap={'10px'}
            direction={{ base: 'column', md: 'row', lg: 'row', xl: 'row', '2xl': 'row' }}
            alignItems={'center'}
            width={'100%'}
          >
            <Box className={`${className}-product_summary_image_container`}>
              <Image
                data-test={testIds.product_page_Image}
                src={imageSrc}
                width={{ base: '21.8rem', md: '25rem', lg: '25rem', xl: '25rem', '2xl': '25rem' }}
                height={200}
                alt={'product_img'}
                objectFit={'contain'}
                className={`${className}-product_summary_image`}
              />
            </Box>
            <Flex
              gap={'10px'}
              direction={'column'}
              alignItems={{ base: 'center', md: 'flex-start', lg: 'flex-start', xl: 'flex-start', '2xl': 'flex-start' }}
              width={'100%'}
            >
              <Box>
                <Typography
                  dataTest={dataTestTitle}
                  className={`${className}-product_summary_name`}
                  text={name}
                  fontSize={'20px'}
                  fontWeight={'500'}
                />
                {domain && (
                  <Text
                    className="domain"
                    fontSize={'0.8rem'}
                    mb={'0.4rem'}
                    noOfLines={2}
                    textOverflow="ellipsis"
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                  >
                    {domain.split(':').join(' ').toLocaleLowerCase()}
                  </Text>
                )}
                {providerName && (
                  <Flex marginTop={'1rem'}>
                    <Typography
                      dataTest={dataTestTitle}
                      className={`${className}-product_summary_provider_name`}
                      text={'Provided by'}
                      fontSize={'15px'}
                      fontWeight={'500'}
                      style={{ marginRight: '0.3rem' }}
                    />
                    <Typography
                      dataTest={dataTestTitle}
                      className={`${className}-product_summary_provider_name`}
                      text={providerName}
                      fontSize={'15px'}
                    />
                  </Flex>
                )}
              </Box>
              {showPriceInSummary && (
                <Box>
                  <ProductPrice
                    color="black"
                    currencyType={productCta?.currency}
                    price={parseFloat(productCta?.totalPrice || '0')}
                    rateLabel={productCta?.rateLabel}
                  />
                </Box>
              )}
              {starRating && <StarRating {...starRating} />}
              {secondaryDescription && (
                <Box minHeight="10rem">
                  <ProductDescription
                    description={secondaryDescription as string}
                    dataTest={dataTestDescription}
                  />
                </Box>
              )}
              {secondaryCTAs && secondaryCTAs.length > 0 && (
                <Box width={{ base: '100%', lg: '50%' }}>
                  <Button {...secondaryCTAs[0]} />
                </Box>
              )}
              {productCta && <ProductCTA {...productCta} />}
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  )
}

export default ProductSummary
