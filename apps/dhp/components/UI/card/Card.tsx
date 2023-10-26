import React from 'react'
import Link from 'next/link'
import { RetailItem } from '../../../lib/types/products'
import CardActions from './CardActions'
import ProductPrice from '../ProductPrice'
import { toBinary } from '../../../utilities/common-utils'
import { Box, Flex, Text, Image, Spacer, Icon } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'

import { FaLocationDot } from 'react-icons/fa6'

interface Props {
  product: RetailItem
}

const Card: React.FC<Props> = ({ product }) => {
  const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))

  return (
    <Box
      maxH={'142px'}
      className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-[#fff] rounded-xl flex relative"
    >
      <Link
        href={{
          pathname: '/product',
          query: { productDetails: encodedProduct }
        }}
        style={{ width: '100%' }}
      >
        <div className="flex md:items-center md:flex-col relative w-full ">
          <Box className=" md:w-full relative  md:px-6  rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center">
            <div className="flex items-center h-full  product-img-span">
              <Image
                src={product.descriptor.images[0]}
                width={'125px'}
                height={'142px'}
                alt={product.descriptor.name}
                className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out rounded-bl-xl rounded-tl-xl "
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
            <Flex justifyContent={'space-between'} alignItems={'flex-start'} w={'100%'} flexDirection={'column'}>
              <Text
                w={'90%'}
                fontWeight={'600'}
                fontSize={'15px'}
                mb={'10px'}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflowWrap="break-word"
                overflow={'hidden'}
              >
                {product.descriptor.name}
              </Text>
              <Text fontSize={'12px'} fontWeight={400}>
                Orthopaedic Surgeon
              </Text>
            </Flex>

            <Flex fontSize={'12px'} alignItems={'center'} mb={'10px'} mt={'10px'}>
              <Text fontWeight={'600'}>Fees</Text>
              <Spacer />
              <Flex align={'center'} gap={'5px'}>
                <Icon as={FaLocationDot} w={'6px'} h={'8px'}></Icon>
                <Text fontWeight={400} fontSize={'12px'} fontFamily={'Poppins'}>
                  800 m
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
              <ProductPrice price={parseFloat(product.price.value)} />
              <Flex alignItems={'center'}>
                <Image src={StarIcon} />
                <Text fontSize={'12px'} pl={'5px'}>
                  {product.tags.Rating}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </div>
      </Link>

      <CardActions product={product} />
    </Box>
  )
}

export default Card
