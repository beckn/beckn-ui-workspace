import React, { useState } from 'react'
import { Box, Flex, Divider, Image, Collapse, IconButton } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { ItemDetailProps } from '@beckn-ui/becknified-components/src/components/checkout/checkout.types'
import ProductPrice from '@beckn-ui/becknified-components/src/components/product-price'
import { formatCurrency } from '@beckn-ui/becknified-components/src/components/product-price/product-price'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const ItemDetails: React.FC<ItemDetailProps> = ({
  title,
  quantity,
  image,
  price,
  currency = 'INR',
  breakUp,
  dataTestTitle = 'item-title'
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <Box
        display="flex"
        width="100%"
      >
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
                alignItems="center"
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
                <IconButton
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  icon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  minW="24px"
                  h="24px"
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
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
