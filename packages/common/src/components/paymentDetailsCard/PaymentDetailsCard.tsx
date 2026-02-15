import { Typography } from '@beckn-ui/molecules'
import { Card, CardBody, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import Styles from './PaymentDetailsCard.module.css'
import { PaymentDetailsCardProps, PaymentMethod } from './PaymentDetailsCard.types'
import { testIds } from '@shared/dataTestIds'

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
            alignItems={'center'}
            mt={'10px'}
            mb={'10px'}
            gap={'8px'}
          >
            <Typography
              fontSize={'17px'}
              fontWeight={'400'}
              text={category}
              dataTest={testIds.paymentpage_creditcardAndDebitCard}
            />
            {category !== 'Other' && (
              <Typography
                color={'#979797'}
                fontSize={'15px'}
                fontWeight={'400'}
                text={t('addCard')}
                flexShrink={0}
              />
            )}
          </Flex>
          <Card className={Styles.border_radius_all}>
            <CardBody padding={'0 20px 15px 20px'}>
              {methods.map((method, index) => {
                const id = `${category}_${index}`
                const isDisabled = method.disabled
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
                    cursor={'pointer'}
                  >
                    <input
                      type="checkbox"
                      id={`radio_${id}`}
                      disabled={isDisabled}
                      checked={checkedState === id}
                      onChange={() => handleChange(id)}
                      className={Styles.radioButton}
                      data-test={testIds.paymentpage_radioButton}
                    />
                    <label
                      htmlFor={`radio_${id}`}
                      className={Styles.label}
                    >
                      <Flex
                        alignItems={'center'}
                        cursor={'pointer'}
                      >
                        {method.img && (
                          <Image
                            src={method.img}
                            w={'62px'}
                            h={'40px'}
                            data-test={testIds.paymentpage_image}
                          />
                        )}
                        <Flex flexDirection={'column'}>
                          <Text
                            fontSize={'15px'}
                            fontWeight={400}
                            data-test={method.dataTest}
                            ml={'6px'}
                          >
                            {method.paymentMethod}
                          </Text>
                          {method.paymentDescription && (
                            <Text
                              fontSize={'12px'}
                              fontWeight={400}
                              // data-test={method.dataTest}
                              ml={'6px'}
                              color={'#7F7D7D'}
                            >
                              {method.paymentDescription}
                            </Text>
                          )}
                        </Flex>
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
