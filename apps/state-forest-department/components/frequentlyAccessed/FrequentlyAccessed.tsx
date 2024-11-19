import React from 'react'
import { Box, CardBody, Flex, Icon, Image, Stack, Card } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { StarIcon, TimeIcon } from '@chakra-ui/icons'
import { CurrencyType, ProductPrice } from '@beckn-ui/becknified-components'

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
    }
    providerCoordinates: {
      latitude: number
      longitude: number | null
    }
  }>
  onCardClick: (item: any) => void
}

const FrequentlyAccessed: React.FC<FrequentlyAccessedProps> = ({ frequentlyAccessedData, onCardClick }) => {
  return (
    <Box mt="80px">
      <Typography
        fontSize="17px"
        fontWeight="400"
        text="Frequently Accessed"
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
              key={index}
              mb={'20px'}
              boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
              borderRadius={'12px'}
              opacity={'unset'}
              cursor={'pointer'}
              w={{ base: '170px', md: '170px', lg: '200px' }}
              padding={'20px'}
              onClick={() => onCardClick(item)}
            >
              <CardBody padding="unset">
                <Stack>
                  <Image
                    src={item.item.images[0].url}
                    alt={item.item.name}
                    objectFit="contain"
                  />
                  <Typography
                    fontSize="12px"
                    fontWeight="600"
                    text={item.item.name}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%'
                    }}
                  />
                  <Typography
                    fontSize="12px"
                    fontWeight="400"
                    text={`Provided By: ${item.providerName}`}
                  />
                  <Flex
                    align="center"
                    justify="space-between"
                    flexWrap={{ base: 'wrap' }}
                    rowGap={{ base: '5px' }}
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
                      />
                    </Flex>
                  </Flex>
                </Stack>
              </CardBody>
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
              color="green.400"
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
