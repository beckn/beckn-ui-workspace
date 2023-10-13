import React, { useEffect, useState } from 'react'
import { ICartProduct } from './cart.type'
import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { HiMinusSm, HiOutlineTrash } from 'react-icons/hi'
import ProductPrice from '../productPrice/ProductPrice'
import Button from '../button'

export const Cart: React.FC<ICartProduct> = props => {
  const { image, name, price, quantity, ...restProps } = props
  const [counter, setCounter] = useState(quantity)

  const handleFetchData = () => {
    console.log('log find')
  }

  useEffect(() => {
    handleFetchData()
  }, [])
  const onClickOrder = () => {}
  return (
    <Flex
      justify="center"
      flexDir={{ base: 'column', md: 'row' }}
      alignItems="start"
      position="relative"
      maxW="2100px"
      mx="auto"
    >
      <Box
        w="100%"
        minW={{ base: 'auto', lg: '50%' }}
        my={4}
        py={4}
        px={2}
        borderBottom="2px"
        borderColor="gray.200"
        marginBottom="4"
      >
        <Flex
          flexWrap="wrap"
          flexDir={{ base: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Box w="107px" h="107px" mb="5px" position="relative">
            <Image src={image} width={200} height={200} alt={name} objectFit="contain" />
          </Box>
          <Box onClick={() => {}} p="1" position={{ base: 'static', sm: 'absolute' }} top="0" right="0">
            {counter === 1 ? <HiOutlineTrash fontSize="1.3rem" color="black" /> : <HiMinusSm fontSize="1rem" />}
          </Box>
          <Text flex="1" fontSize="17px" textAlign="center" mb={{ base: '2', sm: '0' }}>
            {name}
          </Text>
        </Flex>
        <Flex flexWrap="wrap" flexGrow="1" alignItems="center" justifyContent="center" fontSize="15px">
          <Text marginRight="10px">Price</Text>
          {/* <ProductPrice price={parseFloat(price) * counter} isLargeSize /> */}
        </Flex>
      </Box>
      <Divider />
      <h3 className=" sm:text-lg md:text-xl" style={{ fontSize: '17px', fontWeight: 700 }}>
        Order Summary
      </h3>
      <div
        className="flex-grow  bottom-2 left-0 right-0 md:top-36 shadow-lg rounded-lg py-4 xl:py-12 px-4 xl:px-8 -mx-[1rem] md:mx-4 xl:mx-8  w-[100%] md:w-auto  md:min-w-[300px] md:max-w-[400px]"
        style={{
          margin: '20px 0 40px auto',
          zIndex: '9'
        }}
      >
        <div className="flex flex-col my-1 sm:my-2" style={{ fontSize: '15px' }}>
          <div className="flex items-center justify-between my-1 md:my-4">
            <p className="tracking-wide text-md sm:text-base md:text-palette-base">Total Quantity</p>
            <p className="rtl:ml-1 ltr:mr-1">{quantity}</p>
          </div>
          <div className="flex flex-wrap items-baseline justify-between flex-grow my-1 md:my-4">
            <p className="tracking-wide text-md sm:text-base md:text-palette-base">Subtotal</p>
            {/* <ProductPrice price={parseFloat(price) * counter} isLargeSize /> */}
          </div>
          <Divider my={'10px'} />
          <div className="flex flex-wrap items-baseline justify-between flex-grow my-1 md:my-4">
            <p className="font-extrabold tracking-wide text-md sm:text-base md:text-palette-base">Total</p>
            {/* <ProductPrice isLargeSize price={parseFloat(price) * counter} /> */}
          </div>
        </div>
      </div>
      <Button handleClick={onClickOrder}>Order</Button>
    </Flex>
  )
}
