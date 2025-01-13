import React from 'react'
import { Box, CardBody, Flex, Icon, Image, Stack, Card, useTheme, Text } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { StarIcon, TimeIcon } from '@chakra-ui/icons'
import { CurrencyType, ProductPrice } from '@beckn-ui/becknified-components'
import { testIds } from '@shared/dataTestIds'

type FrequentlyAccessedProps = {
  frequentlyAccessedData: Array<{
    id: string
    providerName: string
    item: {
      id: string
      name: string
      long_desc: string
      price: { value: string; currency: string }
      images: { url: string }[]
      rating: string
      productInfo: string
    }
    providerCoordinates: {
      latitude: number
      longitude: number | null
    }
  }>
  onCardClick: (item: any) => void
}

const FrequentlyAccessed: React.FC<FrequentlyAccessedProps> = ({ frequentlyAccessedData, onCardClick }) => {
  const theme = useTheme()
  return (
    <Box mt="80px">
      <Typography
        fontSize="17px"
        fontWeight="400"
        text="Frequently Accessed"
        dataTest={testIds.Frequently_Accessed}
        sx={{ mb: '20px' }}
      />

      {frequentlyAccessedData.length > 0 ? (
        <Flex
          columnGap={3}
          justifyContent="center"
          alignItems={'center'}
          // flexWrap={{ base: 'wrap', md: 'unset', lg: 'unset' }}
        >
          {frequentlyAccessedData.map((item, index) => (
            <Card
              data-test={testIds.Frequently_Accessed_Card}
              key={index}
              mb={'20px'}
              boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
              borderRadius={'12px'}
              opacity={'unset'}
              cursor={'pointer'}
              w={{ base: '170px', md: '170px', lg: '200px' }}
              h={{ base: '330px', md: '400px', lg: '350px' }}
              padding={'20px'}
              onClick={() => onCardClick(item)}
            >
              <CardBody padding="unset">
                <Stack
                  spacing={3}
                  height="100%"
                >
                  <Box
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      src={item.item?.images?.[0]?.url}
                      alt={item.item.name}
                      objectFit="contain"
                      data-test={testIds.Frequently_Accessed_image}
                    />
                  </Box>
                  <Text
                    fontSize={{ base: '10px', md: '12px', lg: '12px' }}
                    fontWeight={600}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    maxWidth={'100%'}
                    data-test={testIds.Frequently_Accessed_item_name}
                  >
                    {item.item.name}
                  </Text>
                  <Text
                    fontSize={{ base: '10px', md: '12px', lg: '12px' }}
                    fontWeight={400}
                    data-test={testIds.Frequently_Accessed_provider_name}
                  >
                    {`Provided By: ${item.providerName}`}
                  </Text>
                  <Text
                    fontSize={{ base: '10px', md: '12px', lg: '12px' }}
                    fontWeight={400}
                    data-test={testIds.Frequently_Accessed_productInfo}
                  >
                    {item.item.productInfo as string}
                  </Text>
                </Stack>
              </CardBody>
              <Flex
                align="center"
                justify="space-between"
                flexWrap={{ base: 'wrap' }}
                rowGap={{ base: '5px' }}
                mt={4}
              >
                <ProductPrice
                  currencyType={item.item.price.currency as CurrencyType}
                  price={parseFloat(item.item.price.value)}
                />
                <Flex
                  align="center"
                  gap="4px"
                >
                  <Icon
                    as={StarIcon}
                    color="yellow.400"
                  />
                  <Typography
                    fontSize="10px"
                    fontWeight="400"
                    text={item.item.rating}
                    data-test={testIds.Frequently_Accessed_item_rating}
                  />
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <>
          <Flex
            justify={'center'}
            mb={'10px'}
            mt={'20px'}
          >
            <Icon
              as={TimeIcon}
              boxSize={10}
              color={theme.colors.primary[100]}
              justifyContent={'center'}
            />
          </Flex>
          <Typography
            fontSize="14px"
            fontWeight="400"
            text="No Items Yet"
            sx={{ textAlign: 'center' }}
          />
        </>
      )}
    </Box>
  )
}

export default FrequentlyAccessed
