import React, { useState } from 'react'
import Link from 'next/link'
import StarRatingComponent from 'react-star-rating-component'
import { RetailItem } from '../../../lib/types/products'
import CardActions from './CardActions'
import ProductPrice from '../ProductPrice'
import { toBinary } from '../../../utilities/common-utils'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import greenVegIcon from '../../../public/images/greenVeg.svg'
import redNonVegIcon from '../../../public/images/redNonVeg.svg'

interface Props {
  product: RetailItem
}

const Card: React.FC<Props> = ({ product }) => {
  const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))

  return (
    <Box
      minH={product.tags.foodType ? '138px' : '168px'}
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
                src={product.descriptor.images[0]}
                width={'110px'}
                height={'133px'}
                alt={product.descriptor.name}
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
                fontWeight={'600'}
                fontSize={'15px'}
                mb={'10px'}
                noOfLines={2}
                textOverflow="ellipsis"
                whiteSpace="pre-wrap"
                overflowWrap="break-word"
              >
                {product.descriptor.name}
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
                Harvey Spectre Law Firm
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
                Family Dispute
              </Text>
            </Flex>
          </Box>
        </div>
      </Link>

      <CardActions product={product} />
    </Box>
  )
}

export default Card
