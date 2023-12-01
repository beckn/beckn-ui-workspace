import React, { useState } from 'react'
import Link from 'next/link'
import StarRatingComponent from 'react-star-rating-component'
import { RetailItem } from '../../../lib/types/products'
import CardActions from './CardActions'
import ProductPrice from '../ProductPrice'
import { toBinary } from '../../../utilities/common-utils'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'

interface Props {
  product: RetailItem
}

const MedicineCard: React.FC<Props> = ({ product }) => {
  const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))

  return (
    <Box
      maxH={'142px'}
      className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-[#fff] rounded-xl flex relative"
    >
      <Link
        href={{
          pathname: '/medicineProduct',
          query: {
            productDetails: encodedProduct
          }
        }}
        style={{ width: '100%' }}
      >
        <div className="flex md:items-center md:flex-col relative w-full ">
          <Box className=" md:w-full relative md:px-6  rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center">
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
            <Box>
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
            </Box>
            <Flex
              fontSize={'12px'}
              alignItems={'center'}
              mb={'8px'}
            >
              <Text pl={'3px'}>Painkiller Tablet</Text>
            </Flex>
            <Flex
              fontSize={'12px'}
              alignItems={'center'}
              mb={'8px'}
            >
              <Text fontWeight={'600'}>Sold by:</Text>
              <Text pl={'3px'}>{(product as any).bppName}</Text>
            </Flex>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <ProductPrice price={parseFloat(product.price.value)} />
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={StarIcon} />
                <Text
                  fontSize={'12px'}
                  pl={'5px'}
                >
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

export default MedicineCard
