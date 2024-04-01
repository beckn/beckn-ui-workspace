import React, { useState } from 'react'
import { Box, Flex, Text, Image, Card, CardBody } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Button from '../components/button/Button'
import CardWithCheckBox from '../components/card/Card'
import { useLanguage } from '../hooks/useLanguage'
import creditCardImg from '../public/images/creditCardImg.svg'

function PaymentMode() {
  const [checked, setChecked] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

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
            fontWeight={400}
            mb={'10px'}
          >
            <Text className="text-ellipsis">{t.cards}</Text>
            <Text
              color={'rgba(var(--color-primary))'}
              fontSize={'17px'}
              fontWeight={400}
            >
              {t.addCard}
            </Text>
          </Flex>
          <Card
            className="border_radius_all"
            mb={'20px'}
          >
            <CardBody padding={'15px 20px'}>
              <Image src={creditCardImg} />
            </CardBody>
          </Card>
        </Box>
        <Text
          marginBottom={'8px'}
          fontSize={'17px'}
        >
          Other
        </Text>
        <CardWithCheckBox
          setChecked={setChecked}
          paymentMethod={t.cashOnDelivery}
        />
      </Box>
      <Box
        position={'absolute'}
        bottom={'10px'}
        width={'90%'}
      >
        <Button
          buttonText={'Continue'}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={!checked}
          handleOnClick={() => {
            router.push('/orderConfirmation')
          }}
        />
      </Box>
    </>
  )
}

export default PaymentMode
