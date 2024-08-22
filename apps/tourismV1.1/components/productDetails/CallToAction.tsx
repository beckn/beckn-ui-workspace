import React, { useEffect, useState } from 'react'
import { HiOutlinePlusSm, HiMinusSm } from 'react-icons/hi'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { RetailItem } from '../../lib/types/products'
import ProductPrice from '../UI/ProductPrice'
import { Box, Flex, Text, Input } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { cartActions } from '@beckn-ui/common'

interface Props {
  product: RetailItem
}
const CallToAction: React.FC<Props> = ({ product }) => {
  const [counter, setCounter] = useState(1)
  const { t } = useLanguage()

  useEffect(() => {
    return () => {
      setCounter(1)
    }
  }, [product])

  const dispatch = useDispatch()
  const router = useRouter()

  function addToCartHandler() {
    dispatch(
      cartActions.addItemToCart({
        product: product,
        quantity: counter
      })
    )
    router.push(`/checkout`)
  }

  function increment() {
    if (counter < 10) {
      setCounter(prev => prev + 1)
    }
  }
  function decrement() {
    if (counter > 1) {
      setCounter(prev => prev - 1)
    }
  }

  function onInputNumberChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
      setCounter(+e.currentTarget.value)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      flexGrow={1}
      w={'100%'}
      maxWidth="350px"
      border="1px solid #BFBFBF"
      shadow="lg"
      borderRadius="xl"
      p={'10px'}
      m={'20px 0px'}
    >
      <div className="w-full flex  items-center ">
        <Text
          as={Typography}
          text={t.total}
          fontSize={'17px'}
          fontWeight={400}
        />
        <ProductPrice
          price={parseFloat(product.price.value)}
          isLargeSize={true}
        />
      </div>
      <Box mt={'15px'}>
        <Text
          as={Typography}
          text={t.noOfTraveller}
          fontSize={'17px'}
          fontWeight={400}
        />
      </Box>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mt="7px"
        cursor="pointer"
      >
        <div
          className="p-2"
          onClick={increment}
        >
          <HiOutlinePlusSm style={{ fontSize: '1.5rem' }} />
        </div>

        <Input
          display="inline-block"
          width="70px"
          py="2"
          mx={{ base: '1', sm: '4' }}
          border="1px"
          borderColor="gray.400"
          textAlign="center"
          type="number"
          min={1}
          max={10}
          value={counter}
          onChange={onInputNumberChangeHandler}
        />
        <div
          onClick={decrement}
          className="p-2"
        >
          <HiMinusSm style={{ fontSize: '1.5rem' }} />
        </div>
      </Flex>
      <br />
      <BecknButton
        text={t.bookNow}
        disabled={false}
        handleClick={addToCartHandler}
      />
    </Box>
  )
}

export default CallToAction
