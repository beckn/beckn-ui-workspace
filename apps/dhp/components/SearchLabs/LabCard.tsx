import React from 'react'
import Link from 'next/link'
import { RetailItem } from '../../lib/types/products'
import CardActions from '../UI/card/CardActions'
import ProductPrice from '../UI/ProductPrice'
import { toBinary } from '../../utilities/common-utils'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import StarIcon from '../../public/images/Star.svg'

interface Props {
  product: RetailItem
}

const LabCard: React.FC<Props> = ({ product }) => {
  const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))

  return (
    <Box
      minH={product.tags.foodType ? '138px' : '168px'}
      maxH={'100%'}
      className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-[#fff] rounded-xl flex relative"
    >
      <Link
        href={{
          pathname: '/labDetails',
          query: { productDetails: encodedProduct }
        }}
      >
        <div className="flex md:items-center md:flex-col relative w-full ">
          <Box
            w={'125px'}
            className=" md:w-full relative bg-slate-400/30  md:px-6  rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center"
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
            <Flex justifyContent={'space-between'} alignItems={'flex-start'} w={'100%'} flexDirection={'column'}>
              <Text
                w={'80%'}
                fontWeight={'600'}
                fontSize={'15px'}
                mb={'5px'}
                noOfLines={2}
                textOverflow="ellipsis"
                whiteSpace="pre-wrap"
                overflowWrap="break-word"
              >
                {product.descriptor.name}
              </Text>
              <Text fontSize={'12px'} fontWeight={400}>
                X-Ray, Blood Test & More
              </Text>
            </Flex>

            <Box fontSize={'12px'} mb={'10px'} mt={'10px'}>
              <Text fontWeight={'600'}>Sold by: </Text>
            </Box>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              position={'absolute'}
              bottom={'-15px'}
              width={'calc(100% - 30px)'}
            >
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

export default LabCard
