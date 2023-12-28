import React, { useState } from 'react'
import { Box, Flex, Text, Image, Card, CardBody, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CardWithCheckBox from '../components/card/Card'
import CardWithUnchecked from '../components/card/CardUncked'
import { useLanguage } from '../hooks/useLanguage'
import phonePay from '../public/images/phonePayPayment.svg'
import CashOnDelivery from '../public/images/cash.svg'
import Visa from '../public/images/visa.svg'
import masterCard from '../public/images/masterCard.svg'

import NetBanking from '../public/images/netbanking.svg'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

function PaymentMode() {
  const [checked, setChecked] = useState(false)
  const theme = useTheme()

  const { t } = useLanguage()
  const router = useRouter()
  const bgColorPrimary = theme.colors.primary['100']

  return (
    <>
      <Box
        height={'72vh'}
        position={'relative'}
      >
        <Box>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            fontSize={'17px'}
            mb={'10px'}
          >
            <Text
              fontSize={'17px'}
              fontWeight={400}
            >
              {t.cards}
            </Text>
            <Text
              color={'#979797'}
              fontSize={'15px'}
              fontWeight={400}
            >
              {t.addCard}
            </Text>
          </Flex>
          <CardWithUnchecked
            setChecked={setChecked}
            img1={Visa}
            img2={masterCard}
            paymentMethod={t.cardNumber}
            paymentMethodNet={t.cardNumber}
          />
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            fontSize={'17px'}
            mb={'10px'}
            mt={'10px'}
          >
            <Text
              fontSize={'17px'}
              fontWeight={400}
            >
              {t.upi}
            </Text>
            <Text
              color={'#979797'}
              fontSize={'15px'}
              fontWeight={400}
            >
              {t.addCard}
            </Text>
          </Flex>
          <Card>
            <CardBody padding={'15px 20px'}>
              <Image src={phonePay} />
            </CardBody>
          </Card>
        </Box>

        <Box mt={'20px'}>
          <Text
            marginBottom={'8px'}
            fontSize={'17px'}
          >
            {t.other}
          </Text>
          <CardWithCheckBox
            setChecked={setChecked}
            img1={NetBanking}
            img2={CashOnDelivery}
            paymentMethod={t.cashOnDelivery}
            paymentMethodNet={t.netBanking}
          />
        </Box>
      </Box>
      <Box
        position={'absolute'}
        bottom={'10px'}
        width={'90%'}
      >
        <BecknButton
          children={t.confirmOrder}
          handleClick={() => router.push('/orderConfirmation')}
          disabled={!checked}
        />
      </Box>
    </>
  )
}

export default PaymentMode
