import React from 'react'
import { Box, CardBody, Flex, Icon, Image, Stack } from '@chakra-ui/react'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import { Typography } from '@beckn-ui/molecules'
import { StarIcon } from '@chakra-ui/icons'

type FrequentlyAccessedProps = {
  frequentlyAccessedData: Array<{
    id: string
    images: string[]
    name: string
    shortDesc: string
    price: { value: number }
    rating: string
    sourceText: string
    yearsOfOperation: number
  }>
}

const FrequentlyAccessed: React.FC<FrequentlyAccessedProps> = ({ frequentlyAccessedData }) => {
  return (
    <Box mt={'40px'}>
      <Typography
        fontSize="17px"
        fontWeight={'400'}
        text="Frequently Accessed"
        sx={{ mb: '20px' }}
      />

      <Flex
        columnGap={3}
        justifyContent={'center'}
        flexWrap={{ base: 'wrap', md: 'nowrap', lg: 'nowrap' }}
      >
        {frequentlyAccessedData.map(
          (
            item: {
              yearsOfOperation: any
              id: string
              images: string[]
              name: string
              shortDesc: string
              price: { value: number }
              rating: string
              sourceText: string
            },
            index: React.Key | null | undefined
          ) => (
            <DetailsCard key={index}>
              <CardBody padding={'unset'}>
                <Stack>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    objectFit="contain"
                  />
                  <Typography
                    fontSize="15px"
                    fontWeight={'600'}
                    text={item.shortDesc}
                  />

                  <Typography
                    fontSize="12px"
                    fontWeight={'400'}
                    text={`Source: ${item.sourceText}`}
                  />
                  <Flex
                    align="center"
                    justify="space-between"
                  >
                    <Typography
                      fontSize="12px"
                      fontWeight={'400'}
                      text={`${item.yearsOfOperation} years in operation`}
                    />
                    <Flex
                      align="center"
                      gap={'4px'}
                    >
                      <Icon
                        as={StarIcon}
                        color="yellow.400"
                      />
                      <Typography
                        fontSize="12px"
                        fontWeight={'400'}
                        text={item.rating}
                      />
                    </Flex>
                  </Flex>
                </Stack>
              </CardBody>
            </DetailsCard>
          )
        )}
      </Flex>
    </Box>
  )
}

export default FrequentlyAccessed
