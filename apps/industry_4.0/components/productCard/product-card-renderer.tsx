import { Flex, Box, Image, Text, Link } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { toBinary } from '@utils/common-utils'
import { useRouter } from 'next/router'
import React from 'react'
import StarIcon from '../../public/images/Star.svg'

const ProductCardRenderer = (data: any) => {
  const { dataSource } = data
  const { t } = useLanguage()
  const router = useRouter()
  const encodedProduct = window.btoa(toBinary(JSON.stringify(dataSource)))
  console.log(dataSource)

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
            height={'168px'}
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
          <Flex flexDir={'column'}>
            <Text pl="3px">{dataSource.providerName}</Text>
            <Text pl="3px">
              Mock description
              {/* {product.descriptor.short_desc} */}
            </Text>
          </Flex>
        </Flex>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          position="absolute"
          width="calc(100% - 30px)"
        >
          <Flex columnGap={'5px'}>
            <Image src={'images/meter.svg'} />
            <Text>800 m</Text>
          </Flex>

          <Flex alignItems="center">
            <Image src={StarIcon} />
            <Text
              fontSize="12px"
              pl="5px"
            >
              3
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
