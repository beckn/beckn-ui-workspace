import React from 'react'
import Link from 'next/link'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { toBinary } from '../../../utilities/common-utils'
import StarIcon from '../../../public/images/Star.svg'
import { useLanguage } from '@hooks/useLanguage'

interface Props {
  product: RetailItem
}

const Card: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))
  return (
    <Flex
      minH={product.tags.foodType ? '138px' : '168px'}
      maxH={'100%'}
      boxShadow="0px 20px 25px rgba(0, 0, 0, 0.10), 0px 8px 10px rgba(0, 0, 0, 0.10)"
      my={1}
      mx={{ md: 6 }}
      rounded="xl"
      bg="#fff"
      position="relative"
    >
      <Box w="125px">
        <Box>
          <Image
            src={product.descriptor.images[0]}
            width={'110px'}
            height={'133px'}
            alt={product.descriptor.name}
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
            {product.descriptor.name}
          </Text>
        </Flex>
        <Flex
          fontSize="12px"
          alignItems="center"
          mb="8px"
        >
          <Text pl="3px">{product.descriptor.short_desc}</Text>
        </Flex>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          position="absolute"
          width="calc(100% - 30px)"
        >
          <Text>800 m</Text>
          <Flex alignItems="center">
            <Image src={StarIcon} />
            <Text
              fontSize="12px"
              pl="5px"
            >
              {product.tags.Rating}
            </Text>
          </Flex>
        </Flex>
        <Box mt={'30px'}>
          <Link
            legacyBehavior
            href={{
              pathname: '/product',
              query: {
                productDetails: encodedProduct
              }
            }}
          >
            <a>
              <Text
                fontSize={'15px'}
                fontWeight={600}
                color={'#0560FA'}
              >
                {t.viewDetails}
              </Text>
            </a>
          </Link>
        </Box>
      </Box>
    </Flex>
  )
}

export default Card
