import React from 'react'
import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import { CurrencyType, formatCurrency } from '../../utilities/currencyFormat'
import { PaymentDetailsProps } from './PaymentDetails.types'

const PaymentDetails: React.FC<PaymentDetailsProps> = (props) => {
    const { qoute } = props
    const { breakup } = qoute

    const { t } = useLanguage()
    return (
        <Box>
            {breakup.map((item, idx) => {
                return (
                    <Flex
                        key={idx}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        pb={'15px'}
                        fontSize={'15px'}
                    >
                        <Text maxWidth={'75%'}>{item.title}</Text>
                        <Text>
                            {formatCurrency(
                                parseFloat(item.price.value),
                                item.price.currency
                            )}
                        </Text>
                    </Flex>
                )
            })}

            <Divider mb={'15px'} />
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                fontSize={'15px'}
                fontWeight={'600'}
            >
                <Text maxWidth={'75%'}>{t.totalText}</Text>
                <Box className="flex">
                    <Text>
                        {formatCurrency(
                            parseFloat(qoute.price.value),
                            qoute.price.currency
                        )}
                    </Text>
                </Box>
            </Flex>
        </Box>
    )
}

export default PaymentDetails
