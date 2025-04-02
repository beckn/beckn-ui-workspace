import React, { useState } from 'react'
import { Box, Flex, Divider, Image, Collapse } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { ItemDetailProps } from './checkout.types'
import { useBreakpoint } from '@chakra-ui/react'
import ProductPrice from '../product-price'
import DownArrowIcon from '@public/images/arrow_drop_down.svg'
import UpArrowIcon from '@public/images/arrow_drop_up.svg'
import { formatCurrency } from '../product-price/product-price'

const ItemDetails: React.FC<ItemDetailProps> = ({
  title,
  quantity,
  description,
  image,
  price,
  currency = 'INR',
  breakUp,
  dataTestTitle = 'item-title',
  dataTestQuantity = 'item-quantity',
  dataTestDescription = 'item-description'
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md']
  const isLargeScreen = !mobileBreakpoints.includes(breakpoint)
  console.log(breakUp)
  return (
    <>
      <Box
        display="flex"
        width="100%"
      >
        {/* {isLargeScreen && (
          <Box mr="1rem">
            <Image
              src={image}
              alt={title.length > 15 ? `${title.substring(0, 15)}...` : title}
              width="4rem"
              height="4rem"
            />
          </Box>
        )} */}

        {/* <Box flexGrow={1}>
          <Flex
            pb={'5px'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              style={{ width: '90%' }}
              dataTest={dataTestTitle}
              text={title}
              variant="subTitleRegular"
            />
            <Typography
              text={`X ${quantity.toString()}`}
              dataTest={dataTestQuantity}
              variant="subTextRegular"
            />
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal' // allow line breaks
              }}
              text={description!}
              dataTest={dataTestDescription}
              variant="subTextRegular"
            />
            <ProductPrice
              price={price}
              currencyType={currency}
            /> */}
        {/* <Typography
              text={priceWithSymbol}
              color="primary.100"
              variant="subTitleRegular"
            /> */}
        {/* </Flex>
        </Box>  */}

        <Box flexGrow={1}>
          <Flex>
            <Box
              mr="1rem"
              width={'20%'}
              alignSelf={'center'}
            >
              <Image
                src={image}
                alt={title.length > 15 ? `${title.substring(0, 15)}...` : title}
                width="4rem"
                height="4rem"
              />
            </Box>
            <Flex
              flexDir={'column'}
              justifyContent="space-between"
              alignItems="start"
              width={'80%'}
              gap={'1rem'}
            >
              <Flex
                flexDirection={'row'}
                justifyContent={'space-between'}
                width={'100%'}
              >
                <Typography
                  text={title}
                  variant="subTitleRegular"
                  dataTest={dataTestTitle}
                  sx={{
                    noOfLines: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal'
                  }}
                />
                <Image
                  onClick={() => setIsExpanded(!isExpanded)}
                  src={isExpanded ? UpArrowIcon : DownArrowIcon}
                  alt="arrow"
                  width="10px"
                  height="10px"
                  alignSelf={'center'}
                />
              </Flex>
              <Flex
                justifyContent={'space-between'}
                width={'100%'}
              >
                <Typography
                  text={`Quantity: ${quantity}`}
                  variant="subTextRegular"
                  color="#595959"
                  fontWeight={'500'}
                  fontSize="12px"
                />
                <ProductPrice
                  price={price}
                  currencyType={currency}
                  fontSize="12px"
                  fontWeight={'600'}
                />
              </Flex>
            </Flex>
          </Flex>

          <Collapse
            in={isExpanded}
            animateOpacity
          >
            <Box
              bg="#F0F0F0"
              p={'10px 15px'}
              borderRadius="md"
              mt={2}
            >
              {breakUp &&
                Object.keys(breakUp).length > 0 &&
                Object.entries(Object.values(breakUp)[0]).map(([key, value]) => (
                  <Flex
                    key={key}
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography
                      text={key}
                      variant="subTextRegular"
                      fontSize="12px"
                      fontWeight={'400'}
                    />
                    <Typography
                      text={`${formatCurrency(Number(value.value), value.currency)}`}
                      variant="subTextRegular"
                      fontSize="12px"
                      fontWeight={'400'}
                    />
                  </Flex>
                ))}

              <Divider my={2} />

              <Flex
                justifyContent="space-between"
                fontWeight="bold"
              >
                <Typography
                  text="Total"
                  variant="subTitleRegular"
                  fontSize="12px"
                  fontWeight={'600'}
                />
                <Typography
                  text={`${formatCurrency(Number(price), currency)}`}
                  variant="subTitleRegular"
                  fontSize="12px"
                  fontWeight={'600'}
                />
              </Flex>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </>
  )
}

export default ItemDetails
