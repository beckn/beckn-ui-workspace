import React from 'react'
import { Box, Divider, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PaymentDetailsProps } from './checkout.types'
import ProductPrice from '../product-price'
import { CheckoutPageTestIds } from '@shared/dataTestIds'

const PaymentDetails: React.FC<PaymentDetailsProps> = props => {
  return (
    <Box width="100%">
      {props.title && (
        <Box marginBottom="1rem">
          <Typography
            variant="subTitleRegular"
            fontSize="17px"
            text={props.title}
          />
        </Box>
      )}
      <Box
        boxShadow={
          props.hasBoxShadow
            ? {
                base: '0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
                md: '0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 8px 20px -5px rgba(0, 0, 0, 0.1)'
              }
            : {}
        }
        padding={{ base: '0', md: '11px 14px' }}
      >
        {Object.entries(props.paymentBreakDown).map(([property, value]) => {
          return (
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              pb={'15px'}
              key={property}
            >
              <Typography
                text={property}
                dataTest={property}
                fontSize={'15px'}
              />
              <ProductPrice
                fontStyle={{
                  fontWeight: '400',
                  color: '#000000',
                  fontSize: '15px'
                }}
                price={value.value}
                currencyType={value.currency}
              />
            </Flex>
          )
        })}

        <Divider mb={'15px'} />
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          fontWeight={'600'}
        >
          <Typography
            variant="titleSemibold"
            text={props.totalText}
            dataTest={CheckoutPageTestIds.totalPayment}
            fontSize={'15px'}
          />
          <div className="flex">
            <ProductPrice
              fontStyle={{
                fontSize: '15px',
                color: '#000000'
              }}
              variant="titleSemibold"
              price={parseFloat(props.totalValueWithCurrency.value)}
              currencyType={props.totalValueWithCurrency.currency}
            />
          </div>
        </Flex>
      </Box>
    </Box>
  )
}

export default PaymentDetails
