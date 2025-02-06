import { Typography } from '@beckn-ui/molecules'
import { Box, Card, CardBody, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import Styles from './BuyPaymentModule.module.css'
import { testIds } from '@shared/dataTestIds'

interface BuyPaymentModuleProps {
  isChecked: boolean
  fare: string
  onChange: (checked: boolean) => void
}

const BuyPaymentModule: React.FC<BuyPaymentModuleProps> = ({ isChecked, fare, onChange }) => {
  const [checked, setChecked] = useState(isChecked)

  const handleCheckboxChange = () => {
    const newCheckedState = !checked
    setChecked(newCheckedState)
    onChange(newCheckedState)
  }

  return (
    <>
      <Card className={Styles.border_radius_all}>
        <CardBody padding={'0 20px 15px 20px'}>
          <Flex
            className={Styles.checkbox}
            alignItems={'center'}
            columnGap={'13px'}
            position={'relative'}
            pt={'15px'}
            cursor={'pointer'}
          >
            <input
              type="checkbox"
              className={Styles.radioButton}
              data-test={testIds.paymentpage_radioButton}
              checked={checked}
              onChange={handleCheckboxChange}
            />
            <label
              className={Styles.label}
              onClick={handleCheckboxChange}
            >
              <Flex
                alignItems={'center'}
                cursor={'pointer'}
              >
                <Image
                  src={'./images/master@3x.svg'}
                  w={'62px'}
                  h={'40px'}
                  data-test={testIds.paymentpage_image}
                />
                <Box ml="15px">
                  <Text
                    fontSize={'15px'}
                    fontWeight={400}
                    ml={'6px'}
                  >
                    OpenSpark Wallet
                  </Text>
                  <Text
                    fontSize={'10px'}
                    fontWeight={400}
                    ml={'6px'}
                    pt="4px"
                    color="#4498E8"
                  >
                    {fare}
                  </Text>
                </Box>
              </Flex>
            </label>
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}

export default BuyPaymentModule
