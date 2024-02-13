import { Flex, Box, Text, Image, Divider, Textarea } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { CancelOrderPropsModel } from './cancel-order.types'
import styles from '../../../components/card/Card.module.css'
import Button from '../../../components/button/Button'

const CancelOrder: React.FC<CancelOrderPropsModel> = ({
    cancelOrderModalClose,
    cancellationType,
    handleCancelButtonClick,
    handleCheckboxChange,
}) => {
    const { t } = useLanguage()

    return (
        <>
            <Box padding={'8px'}>
                <Flex
                    justifyContent={'space-between'}
                    alignItems="center"
                    pb={'20px'}
                    pt="6px"
                >
                    <Text
                        fontSize={'17px'}
                        fontWeight="600"
                    >
                        {t.orderCancellation}
                    </Text>
                    <Image
                        onClick={cancelOrderModalClose}
                        src="./images/crossIcon.svg"
                        alt="cross img"
                    />
                </Flex>
                <Divider />

                <Text
                    pt={'20px'}
                    pb="15px"
                    fontWeight={'500'}
                    fontSize={'15px'}
                >
                    {t.cancellationType}
                </Text>

                {cancellationType.map((Type, ind) => {
                    return (
                        <Box
                            key={Type.id}
                            className={styles.checkbox}
                            mb={'15px'}
                            fontSize={'15px'}
                        >
                            <input
                                type="checkbox"
                                id={Type.id}
                                checked={Type.checked || false}
                                onChange={() => handleCheckboxChange(Type.id)}
                            />
                            <label
                                htmlFor={Type.id}
                                style={{ left: '24px' }}
                            >
                                <Text
                                    mt={'-3px'}
                                    position={'absolute'}
                                    width={'50vw'}
                                    marginLeft="40px"
                                >
                                    {Type.cancellationTypeText}
                                </Text>
                            </label>
                        </Box>
                    )
                })}
                <Textarea
                    w="332px"
                    height="124px"
                    resize="none"
                    placeholder="Please specify the reason"
                    boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)"
                    mb={'15px'}
                />
            </Box>
            <Button
                buttonText={t.proceedToPay}
                isDisabled={!cancellationType.some((type) => type.checked)}
                type={'solid'}
                handleOnClick={handleCancelButtonClick}
            />
        </>
    )
}

export default React.memo(CancelOrder)
