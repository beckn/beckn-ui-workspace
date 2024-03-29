import { Flex, Box, Image, Text, Link } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { toBinary } from '@utils/common-utils'
import { calculateDistance, Coordinate } from '@utils/homePage.utils'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import StarIcon from '../../public/images/Star.svg'

const ProductCardRenderer = (data: any) => {
  const [distance, setDistance] = useState(0)
  const { dataSource } = data
  const { t } = useLanguage()
  const router = useRouter()
  const encodedProduct = window.btoa(toBinary(JSON.stringify(dataSource)))

  useEffect(() => {
    const stringifiedCoords = localStorage.getItem('coordinates') as string
    const parsedThing: Coordinate = JSON.parse(stringifiedCoords)

    const distance = calculateDistance(parsedThing, dataSource.providerCoordinates)
    setDistance(Math.floor(distance))
  }, [])

  //   TODO :- have to fix CSS as well as remove mock data and add dynamic data
  return (
    <Flex
      minH={'168px'}
      maxH={'100%'}
      boxShadow="0px 20px 25px rgba(0, 0, 0, 0.10), 0px 8px 10px rgba(0, 0, 0, 0.10)"
      my={1}
      mx={{ md: 6 }}
      rounded="xl"
      bg="#fff"
      position="relative"
      mb={'20px'}
    >
      <Box w="125px">
        <Box>
          <Image
            width={'110px'}
            height={'188px'}
            src={dataSource.item.images[0].url}
            alt={dataSource.item.name}
            borderTopLeftRadius={'10px'}
            borderBottomLeftRadius={'10px'}
          />
        </Box>
      </Box>
      <Box
        p="10px"
        pt="11px"
        w="63%"
        position="relative"
      >
        <Flex
          justifyContent="space-between"
          alignItems="flex-start"
          w="100%"
        >
          <Text
            w="80%"
            fontWeight="600"
            fontSize="15px"
            mb="10px"
            noOfLines={2}
            textOverflow="ellipsis"
            whiteSpace="pre-wrap"
            overflowWrap="break-word"
          >
            {dataSource.item.name}
          </Text>
        </Flex>
        <Flex
          fontSize="12px"
          alignItems="center"
          mb="8px"
        >
          <Flex
            flexDir={'column'}
            gap={'5px'}
          >
            <Text pl="3px">{dataSource.providerName}</Text>
            <Text
              pl="3px"
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              noOfLines={2}
              w={'100%'}
            >
              {dataSource.item.short_desc}
            </Text>
          </Flex>
        </Flex>

        <Flex
          justifyContent="end"
          alignItems="center"
          position="absolute"
          width="calc(100% - 30px)"
        >
          {/* <Flex columnGap={'5px'}>
            <Image src={'images/meter.svg'} />
            <Text>
              {distance} {distance > 1 ? 'km' : 'm'}
            </Text>
          </Flex> */}

          <Flex alignItems="center">
            <Image src={StarIcon} />
            <Text
              fontSize="12px"
              pl="5px"
            >
              {dataSource.rating}
            </Text>
          </Flex>
        </Flex>
        <Box
          onClick={() => {
            localStorage.setItem('selectedItem', JSON.stringify(dataSource))
            router.push(`/product?productDetails=${encodedProduct}`)
          }}
          mt={'30px'}
        >
          <Text
            fontSize={'15px'}
            fontWeight={600}
            color={'#0560FA'}
          >
            {t.viewDetails}
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default ProductCardRenderer
