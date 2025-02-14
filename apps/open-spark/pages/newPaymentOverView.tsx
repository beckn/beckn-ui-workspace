import { DetailCard } from '@beckn-ui/becknified-components'
import {
  cartActions,
  DiscoveryRootState,
  ICartRootState,
  ParsedItemModel,
  PaymentBreakDownModel
} from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Divider, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const NewPaymentOverView = () => {
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const selectedEmi = useSelector((state: any) => state.selectedEmi.apiResponse[0]?.message.order.items) || 0
  const monthlyInstallment = useSelector((state: any) => state.selectedEmi.emiDetails)
  const [totalValue, setTotalValue] = useState<{ total: number; discountAmount: number }>({
    total: 0,
    discountAmount: 0
  })
  const [payableValue, setPayableValue] = useState<number>()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const dispatch = useDispatch()

  const createPaymentBreakdownMap = () => {
    const total = cartItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 1
      return sum + quantity * Number(item.price?.value || 0)
    }, 0)

    const discountPercentage = Number(selectedEmi[0]?.code) || 0
    const discountAmount = (total * discountPercentage) / 100

    setTotalValue({ total, discountAmount })
    setPayableValue(total - discountAmount)
  }

  useEffect(() => {
    createPaymentBreakdownMap()
  }, [])
  return (
    <>
      <Typography
        text="Order Overview"
        fontSize="17px"
      />
      <Box
        mt="8px"
        mb="20px"
      >
        <DetailCard>
          {cartItems.map(items => (
            <>
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                mb="10px"
              >
                <Typography
                  fontSize="15px"
                  text={items.name}
                />
                <Typography
                  text={items.quantity}
                  fontSize="12px"
                  fontWeight="600"
                />
              </Flex>
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
              >
                <Typography
                  fontSize="12px"
                  text={items.providerName}
                />
                <Flex alignItems={'center'}>
                  <Typography
                    fontWeight="600"
                    fontSize="12px"
                    text={'Rs.'}
                    style={{ paddingRight: '2px' }}
                  />
                  <Typography
                    fontWeight="600"
                    fontSize="12px"
                    text={items.price.value}
                  />
                </Flex>
              </Flex>
              <Divider
                mt="15px"
                mb="15px"
              />
            </>
          ))}
        </DetailCard>
      </Box>
      <Typography
        text="New Payment Options"
        fontSize="17px"
      />
      <Box mt="8px">
        <DetailCard>
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
            mb="15px"
          >
            <Typography
              fontSize="15px"
              text={'Total Battery Cost'}
            />
            <Flex alignItems={'center'}>
              <Typography
                fontSize="15px"
                text={'Rs.'}
                style={{ paddingRight: '2px' }}
              />
              <Typography
                fontSize="15px"
                text={totalValue.total}
              />
            </Flex>
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              fontSize="15px"
              text={`Loan Approved ${selectedEmi[0].code}%`}
            />
            <Flex alignItems={'center'}>
              <Typography
                fontSize="15px"
                text={'-Rs.'}
                style={{ paddingRight: '2px' }}
              />
              <Typography
                fontSize="15px"
                text={totalValue.discountAmount}
              />
            </Flex>
          </Flex>
          <Divider
            mt="15px"
            mb="15px"
          />
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              fontWeight="600"
              fontSize="15px"
              text={'Total Amount to be paid up front'}
            />
            <Flex alignItems={'center'}>
              <Typography
                fontSize="15px"
                fontWeight="600"
                text={'Rs.'}
                style={{ paddingRight: '2px' }}
              />
              <Typography
                fontSize="15px"
                fontWeight="600"
                text={payableValue}
              />
            </Flex>
          </Flex>
        </DetailCard>
        <Typography
          text="Loan Tenure"
          fontSize="17px"
        />
        <Box mt="8px">
          <DetailCard>
            <RadioGroup>
              {selectedEmi.map((emiPlan, ind: number) => (
                <React.Fragment key={emiPlan.id}>
                  <Box
                    flex="1"
                    textAlign="left"
                  >
                    <Stack direction="row">
                      <Radio
                        _focusVisible={{ boxShadow: 'unset' }}
                        value={emiPlan.id}
                        colorScheme="green"
                        className="radio-for-emi"
                      />
                      <Box p="10px">
                        <Text fontSize="15px">
                          {emiPlan.name} months: ₹ {monthlyInstallment[ind].monthlyInstallment}/months
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                  <Divider
                    mt="10px"
                    mb="10px"
                  />
                </React.Fragment>
              ))}
            </RadioGroup>
          </DetailCard>
        </Box>
      </Box>
      <BecknButton
        text="Proceed to Payment"
        handleClick={() => {
          Router.push('/retailPaymentMethod')
          dispatch(cartActions.clearCart())
        }}
      />
    </>
  )
}

export default NewPaymentOverView
