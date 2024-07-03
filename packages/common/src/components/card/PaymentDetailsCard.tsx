import { Typography } from '@beckn-ui/molecules'
import { Card, CardBody, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { PaymentDetailsCardProps, PaymentMethod } from '../../../lib/types/components'
import Styles from './PaymentDetailsCard.module.css'

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({ t, paymentMethods, checkedState, handleChange }) => {
  const groupedPaymentMethods = paymentMethods.reduce(
    (acc, method) => {
      if (!acc[method.category]) {
        acc[method.category] = []
      }
      acc[method.category].push(method)
      return acc
    },
    {} as Record<string, PaymentMethod[]>
  )

  return (
    <>
      {Object.entries(groupedPaymentMethods).map(([category, methods]) => (
        <React.Fragment key={category}>
          <Flex
            justifyContent={'space-between'}
            mb={'10px'}
          >
            <Typography
              fontSize={'17px'}
              fontWeight={'400'}
              text={category}
            />
            {category !== 'Other' && (
              <Typography
                color={'#979797'}
                fontSize={'15px'}
                fontWeight={'400'}
                text={t('addCard')}
              />
            )}
          </Flex>
          <Card className={Styles.border_radius_all}>
            <CardBody padding={'0 20px 15px 20px'}>
              {methods.map((method, index) => {
                const id = `${category}_${index}`
                const isDisabled = category !== 'Other'
                return (
                  <Flex
                    key={id}
                    pointerEvents={`${isDisabled ? 'none' : 'initial'}`}
                    opacity={`${isDisabled ? '0.5' : '1'}`}
                    className={Styles.checkbox}
                    alignItems={'center'}
                    columnGap={'13px'}
                    position={'relative'}
                    pt={'15px'}
                  >
                    <input
                      type="checkbox"
                      id={`radio_${id}`}
                      disabled={isDisabled}
                      checked={checkedState === id}
                      onChange={() => handleChange(id)}
                      className={Styles.radioButton}
                    />
                    <label
                      htmlFor={`radio_${id}`}
                      className={Styles.label}
                    >
                      <Flex alignItems={'center'}>
                        <Image
                          src={method.img}
                          w={'62px'}
                          h={'40px'}
                        />
                        <Text
                          fontSize={'15px'}
                          fontWeight={400}
                          ml={'6px'}
                        >
                          {method.paymentMethod}
                        </Text>
                      </Flex>
                    </label>
                  </Flex>
                )
              })}
            </CardBody>
          </Card>
        </React.Fragment>
      ))}
    </>
  )
}

export default React.memo(PaymentDetailsCard)
