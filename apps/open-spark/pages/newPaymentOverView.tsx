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
import { Box, Divider, Flex, Radio, RadioGroup, Stack, Text, Image } from '@chakra-ui/react'
import { setEmiDetails } from '@store/emiSelect-slice'
import { currencyFormat } from '@utils/general'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const NewPaymentOverView = () => {
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const selectedEmi = useSelector((state: any) => state.selectedEmi.apiResponse[0]?.message.order.items) || 0
  const processingFee =
    useSelector((state: any) => state.selectedEmi.apiResponse[0]?.message.order.provider.short_desc) || 0
  const coverage = useSelector((state: any) => state.discoveryEmiPlan.products[0]?.item[0]?.code) || 0
  const monthlyInstallment = useSelector((state: any) => state.selectedEmi.emiDetails)
  const [totalValue, setTotalValue] = useState<{ total: number; discountAmount: number }>({
    total: 0,
    discountAmount: 0
  })
  const [selectedEmiPlan, setSelectedEmiPlan] = useState<string | null>(null)
  const [payableValue, setPayableValue] = useState<number>()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const dispatch = useDispatch()
  const emiDetails = useSelector((state: any) => state.selectedEmi.emiDetails[0])

  const createPaymentBreakdownMap = () => {
    const total = cartItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 1
      return sum + quantity * Number(item.price?.value || 0)
    }, 0)

    const discountPercentage = Number(coverage)
    const discountAmount = total * (discountPercentage / 100)

    setTotalValue({ total, discountAmount })
    setPayableValue(total - discountAmount - Number(processingFee))
  }

  useEffect(() => {
    createPaymentBreakdownMap()
  }, [])
  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
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
            <React.Fragment>
              <Box pb="10px">
                <Flex alignItems={'center'}>
                  <Image
                    src={items.images?.[0].url}
                    alt={'img'}
                    width="120px"
                    height="94px"
                  />
                  <Box>
                    <Text
                      fontSize="15px"
                      fontWeight="600"
                      noOfLines={2}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      height={'fit-content'}
                      mb="10px"
                    >
                      {items.name}
                    </Text>
                    <Typography
                      text={items.short_desc}
                      variant="subTextRegular"
                    />
                    <Flex>
                      <Typography
                        fontWeight="600"
                        text={'Sold by:'}
                        variant="subTextRegular"
                        style={{ width: '68px' }}
                      />
                      <Typography
                        text={items?.productInfo?.providerName}
                        variant="subTextRegular"
                      />
                    </Flex>
                  </Box>
                </Flex>

                <Box>
                  <Flex
                    pb="5px"
                    alignItems="center"
                  >
                    <Flex
                      alignItems="center"
                      w={'unset'}
                    >
                      <Text
                        mr="10px"
                        fontWeight={'600'}
                      >
                        Qty
                      </Text>
                      <Typography
                        className="quantity-checkout"
                        text={items.quantity}
                        fontSize="12px"
                        fontWeight="600"
                      />
                    </Flex>
                    <Box ml="25px">
                      <Typography
                        color="#4398E8"
                        fontWeight="600"
                        fontSize="12px"
                        text={`₹ ${currencyFormat(Number(items.price.value) * items.quantity)}`}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Box>
              <Divider />
            </React.Fragment>
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
                text={currencyFormat(totalValue.total)}
              />
            </Flex>
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              fontSize="15px"
              text={`Loan Approved (${coverage}%)`}
            />
            <Flex alignItems={'center'}>
              <Typography
                fontSize="15px"
                text={'-Rs.'}
                style={{ paddingRight: '2px' }}
              />
              <Typography
                fontSize="15px"
                text={currencyFormat(totalValue.discountAmount)}
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
              style={{ width: '12rem' }}
              text={'Total Amount to be paid upfront'}
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
                text={currencyFormat(Number(payableValue?.toFixed(2)))}
              />
            </Flex>
          </Flex>
        </DetailCard>
        {/* <Typography
          text="Loan Tenure"
          fontSize="17px"
        /> */}
        {/* <Box mt="8px">
          <DetailCard>
            <RadioGroup onChange={value => setSelectedEmiPlan(value)}>
              {selectedEmi.map((emiPlan: any, ind: number) => (
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
                          {emiPlan.name} months: ₹ {currencyFormat(monthlyInstallment[ind].emi)}/months
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
        </Box> */}
      </Box>
      <BecknButton
        text="Proceed to Payment"
        // disabled={!selectedEmiPlan}
        handleClick={() => {
          dispatch(
            setEmiDetails({
              emiDetails: [
                {
                  ...emiDetails,
                  payableAmount: Number(payableValue?.toFixed(2))
                }
              ]
            })
          )
          Router.push('/retailPaymentMethod')
        }}
      />
    </Box>
  )
}

export default NewPaymentOverView
