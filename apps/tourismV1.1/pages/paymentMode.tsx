import React, { useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CardWithCheckBox from '../components/card/Card'
import CardWithUnchecked from '../components/card/CardUncked'
import { useLanguage } from '../hooks/useLanguage'
import CashOnDelivery from '../public/images/cash.svg'
import Visa from '../public/images/visa.svg'
import masterCard from '../public/images/masterCard.svg'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

function PaymentMode() {
  const [checked, setChecked] = useState(false)

  const { t } = useLanguage()
  const router = useRouter()

  return (
    <Box>
      <Box
        position={'relative'}
        maxWidth={{ base: '90%', md: '70%' }}
        margin="auto"
        className="hideScroll"
        maxH="calc(100vh - 120px)"
        overflowY={'scroll'}
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
            img2={CashOnDelivery}
            paymentMethod={t.cashOnDelivery}
          />
        </Box>

        <Box
          width={{ base: '100%', md: '70%' }}
          style={{ marginTop: '2rem ' }}
        >
          <BecknButton
            children={t.confirmOrder}
            handleClick={() => router.push('/orderConfirmation')}
            disabled={!checked}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentMode
