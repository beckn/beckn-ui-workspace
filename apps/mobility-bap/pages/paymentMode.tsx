import React, { useState } from 'react'
import { Box, Flex, Text, Image, Card, CardBody, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CardWithCheckBox from '../components/card/Card'
import { useLanguage } from '../hooks/useLanguage'
import creditCardImg from '../public/images/creditCardImg.svg'
import { Button } from '@beckn-ui/molecules'

function PaymentMode() {
  const theme = useTheme()
  const [checked, setChecked] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <>
      <Box position={'relative'}>
        <Box
          p={'8px 20px'}
          mt="4px"
          ml="-20px"
          fontSize={'15px'}
          textAlign="center"
          mr="-20px"
          boxShadow="0px 4px 60px 0px #0000001A"
        >
          Select Payment Method
        </Box>
        <Box mt={'30px'}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            fontSize={'17px'}
            fontWeight={400}
            mb={'16px'}
          >
            <Text
              className="text-ellipsis"
              fontSize={'17px'}
            >
              {t.cards}
            </Text>
            <Text
              color={theme.colors.primary['100']}
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
          text="Continue"
          variant="solid"
          disabled={!checked}
          handleClick={() => router.push('/driverDetails')}
        />
      </Box>
    </>
  )
}

export default PaymentMode
