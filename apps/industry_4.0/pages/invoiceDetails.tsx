import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import { Accordion, Typography } from '@beckn-ui/molecules/src/components'
import { Box, Divider, Flex, HStack, Stack } from '@chakra-ui/react'
import Qrcode from '@components/qrCode/Qrcode'
import { useLanguage } from '@hooks/useLanguage'
import React from 'react'

const invoiceDetails = ({ props }) => {
  const { t } = useLanguage()
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <DetailsCard>
        <Box pb={'15px'}>
          <Typography
            variant="titleSemibold"
            text={t.orderOverview}
          />
        </Box>
        <Flex
          pb={'4px'}
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography
            variant="subTitleSemibold"
            text={'Assembly'}
          />
          <Typography
            variant="subTitleRegular"
            text={'€ 30,000'}
          />
        </Flex>
        <Box pb={'4px'}>
          <Typography
            variant="subTitleRegular"
            text={'RTAL Assembly Lines'}
          />
        </Box>
        <Box pb={'4px'}>
          <Typography
            variant="subTitleRegular"
            text={'Qty: 150'}
          />
        </Box>
        <Divider
          mt="10px"
          mb="10px"
        />
        <Flex
          pb={'15px'}
          pt="10px"
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography
            variant="subTitleSemibold"
            text={'Shipping'}
          />
          <Typography
            variant="subTitleRegular"
            text={'€ 30,000'}
          />
        </Flex>
        <Typography
          variant="subTitleRegular"
          text={'151-e, Janpath Road, New Delhi'}
        />
      </DetailsCard>
      <DetailsCard>
        <Box pb={'15px'}>
          <Typography
            variant="titleSemibold"
            text={t.payment}
          />
        </Box>
        <PaymentDetails
          paymentBreakDown={{
            'Total Manufacturing Cost': `${t.currencySymbol} 1,20,000`,
            'Logistic Services': `${t.currencySymbol} 28,000`,
            Taxes: `${t.currencySymbol} 12000`
          }}
          totalText="Total"
          totalValueWithSymbol={`${t.currencySymbol} 1,60,000`}
        />
      </DetailsCard>
      <Stack>
        <Accordion accordionHeader={t.openInWallet}>
          <HStack
            justifyContent={'center'}
            alignItems={'center'}
            pb={'20px'}
          >
            <Qrcode value={'https://odr-dev.becknprotocol.io/'} />
          </HStack>
        </Accordion>
        <Accordion accordionHeader={t.viewJSON}>
          <HStack
            justifyContent={'center'}
            alignItems={'center'}
            pb={'20px'}
          >
            <Qrcode value={'https://odr-dev.becknprotocol.io/'} />
          </HStack>
        </Accordion>
      </Stack>
    </Box>
  )
}

export default invoiceDetails
