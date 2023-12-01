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
                src={
                  (product.itemImages?.[0]?.url || product.providerImage) ??
                  'https://imgs.search.brave.com/dP8znd4KG19WF0aZ3xL1B4KCu9ek1bHi6FICyW2GokU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vOTcxNDA2/MC80NzgxNS9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzQ3ODE1MDA1/Mi1zdG9jay1waG90/by1tZWRpYXRpb24t/d29yZC13b29kZW4t/YmxvY2tzLWNvbW11/bmljYXRpb24uanBn'
                }
                width={'110px'}
                height={'133px'}
                alt={product.name ?? 'Mediation Service'}
                className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out "
              />
            </div>
          </Box>
          <Box
            p={'10px'}
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
                {product.name ?? 'Mediation Service'}
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
                {product.providerName ?? 'Presolv360'}
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
                {product.categories?.[0]?.name ?? 'Commercial Dispute'}
              </Text>
            </Flex>
            <Flex
              alignItems={'center'}
              mb={'8px'}
              gap={'5px'}
            >
              <Image
                src="/images/language.svg"
                w={'12px'}
                h={'12px'}
              />
              <Text
                fontWeight={'400'}
                fontSize={'12px'}
              >
                English, Hindi, Kannada +3
              </Text>
            </Flex>
          </Box>
        </div>
      </Link>
    </Box>
  )
}

export default Card
