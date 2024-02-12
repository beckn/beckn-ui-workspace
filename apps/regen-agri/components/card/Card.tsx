import { Box, Card, CardBody, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

import styles from './Card.module.css'

export type PaymentMethodsInfo = {
    paymentMethod: string
    isDisabled: boolean
    id: string
}
export interface CardWithCheckBoxPropsModel {
    paymentMethods: PaymentMethodsInfo[]
    setSelectedPaymentMethod: React.Dispatch<
        React.SetStateAction<string | null>
    >
    selectedPaymentMethod: string | null
}

const CardWithCheckBox: React.FC<CardWithCheckBoxPropsModel> = (props) => {
    const handleChange = (id: string) => {
        props.setSelectedPaymentMethod(
            id === props.selectedPaymentMethod ? null : id
        )
    }

    return (
        <Card className="border_radius_all">
            <CardBody padding={'15px 20px'}>
                {props.paymentMethods.map((method) => {
                    return (
                        <Box
                            key={method.id}
                            className={styles.checkbox}
                            mb={'15px'}
                            fontSize={'15px'}
                            pointerEvents={method.isDisabled ? 'none' : 'auto'}
                            opacity={method.isDisabled ? '0.5' : '1'}
                        >
                            <input
                                type="checkbox"
                                id={method.id}
                                onChange={() => handleChange(method.id)}
                                checked={
                                    method.id === props.selectedPaymentMethod
                                }
                            />
                            <label htmlFor={method.id}>
                                <Text
                                    mt={'-3px'}
                                    position={'absolute'}
                                    width={'50vw'}
                                    marginLeft="40px"
                                >
                                    {method.paymentMethod}
                                </Text>
                            </label>
                        </Box>
                    )
                })}
            </CardBody>
        </Card>
    )
}

export default React.memo(CardWithCheckBox)
