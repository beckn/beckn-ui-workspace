import { Flex, Box, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import StarIcon from '../../public/images/Star.svg'
import { toBinary } from '../../utilities/common-utils'
import ProductPrice from '../UI/ProductPrice'

const ProductCardRenderer = (data: any) => {
  //   const [distance, setDistance] = useState(0)
  const { dataSource } = data
  const router = useRouter()
  const encodedProduct = window.btoa(toBinary(JSON.stringify(dataSource)))

  const extraInfoMapper: { [key: string]: string } = {
    ['Duration']: dataSource.courseDuration,
    ['Sold by']: dataSource.providerName
  }

  //   TODO :- to do some refactoring here and get some components from buolding block
  return (
    <Flex
      onClick={() => {
        localStorage.setItem('selectedItem', JSON.stringify(dataSource))
        router.push(`/product?productDetails=${encodedProduct}`)
      }}
      minH={'168px'}
      maxH={'100%'}
      boxShadow="0px 20px 25px rgba(0, 0, 0, 0.10), 0px 8px 10px rgba(0, 0, 0, 0.10)"
      mt={'30px'}
      mx={{ md: 6 }}
      rounded="xl"
      bg="#fff"
      position="relative"
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
        display={'flex'}
        flexDir={'column'}
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

        {Object.keys(extraInfoMapper).map((key, idx) => {
          return (
            <Flex
              key={idx}
              fontSize="12px"
              alignItems="center"
              mb="8px"
            >
              <Text fontWeight="600">{key}:</Text>
              <Text
                pl="3px"
                noOfLines={1}
                textOverflow="ellipsis"
                whiteSpace="pre-wrap"
                overflowWrap="break-word"
              >
                {extraInfoMapper[key]}
              </Text>
            </Flex>
          )
        })}

        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          position={'absolute'}
          bottom={'11px'}
          width={'calc(100% - 30px)'}
        >
          <ProductPrice price={parseFloat(dataSource.item.price.value)} />
          <Flex alignItems={'center'}>
            <Image
              alt="rating-icon"
              src={StarIcon}
            />
            <Text
              fontSize="12px"
              pl="5px"
            >
              {dataSource.item.rating}
            </Text>
          </Flex>
        </Flex>
        {/* </Flex> */}
      </Box>
    </Flex>
  )
}

export default ProductCardRenderer
