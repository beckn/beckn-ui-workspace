import React from 'react'
import Link from 'next/link'
import { toBinary } from '../../../utilities/common-utils'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { ParsedScholarshipData } from '../../productList/ProductList.utils'

interface Props {
  product: ParsedScholarshipData
}

const Card: React.FC<Props> = ({ product }) => {
  const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))

  return (
    <Box
      minH={'168px'}
      maxH={'100%'}
      p={'10px'}
      className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-[#fff] rounded-xl flex relative"
    >
      <Link
        href={{
          pathname: '/product',
          query: { productDetails: encodedProduct }
        }}
      >
        <div className="flex md:items-center md:flex-col relative w-full ">
          <Box
            w={'125px'}
            className=" md:w-full relativ md:px-6  rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center"
          >
            <div className="flex items-center h-full  product-img-span">
              <Image
                src={product.itemImages[0].url}
                width={'110px'}
                height={'133px'}
                alt={product.name}
                className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out "
              />
            </div>
          </Box>
          <Box
            p={'15px'}
            pt={'11px'}
            w={'63%'}
            position={'relative'}
            className="flex flex-col md:w-full md:px-3  md:py-4"
          >
            <Flex
              justifyContent={'space-between'}
              alignItems={'flex-start'}
              w={'100%'}
            >
              <Text
                w={'80%'}
                fontWeight={'700'}
                fontSize={'15px'}
                mb={'10px'}
                noOfLines={2}
                textOverflow="ellipsis"
                whiteSpace="pre-wrap"
                overflowWrap="break-word"
              >
                {product.name}
              </Text>
            </Flex>
            <Flex
              alignItems={'center'}
              mb={'8px'}
            >
              <Text
                fontSize={'12px'}
                fontWeight={'400'}
              >
                {product.platformName}
              </Text>
            </Flex>
            <Flex
              alignItems={'center'}
              mb={'8px'}
            >
              <Text
                fontWeight={'400'}
                fontSize={'12px'}
              >
                Service Language:
              </Text>
              <Text
                pl={'3px'}
                fontWeight={'600'}
                fontSize={'12px'}
              >
                English
              </Text>
            </Flex>
            <Flex
              alignItems={'center'}
              mb={'8px'}
            >
              <Text
                fontWeight={'400'}
                fontSize={'12px'}
              >
                {product.categories[0].name}
              </Text>
            </Flex>
          </Box>
        </div>
      </Link>
    </Box>
  )
}

export default Card
