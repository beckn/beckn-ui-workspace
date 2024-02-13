import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useLanguage } from '../hooks/useLanguage'
import { useRouter } from 'next/router'
import React from 'react'
import Button from '../components/button/Button'

const OrderCancellation = () => {
    const { t } = useLanguage()
    const router = useRouter()
    return (
        <Box
            className="hideScroll"
            maxH={'calc(100vh - 100px)'}
        >
            <Flex
                justifyContent={'center'}
                alignItems={'center'}
                mb={'20px'}
            >
                <Flex
                    mt={'45px'}
                    flexDir={'column'}
                    textAlign={'center'}
                >
                    <Image
                        src="/images/cancelOrderHome.svg"
                        mb={'35px'}
                        alt="cancelIcon"
                    />
                    <Text
                        fontSize={'17px'}
                        fontWeight={600}
                        mb={'10px'}
                    >
                        {t.orderCancel}
                    </Text>
                    <Text
                        fontSize={'15px'}
                        fontWeight={400}
                    >
                        {t.yourOrderHasBeencancel}
                    </Text>
                    <Text
                        fontSize={'15px'}
                        fontWeight={400}
                    >
                        {t.ifYouPaid}
                    </Text>
                    <Text
                        fontSize={'15px'}
                        fontWeight={400}
                    >
                        {t.refundedSoon}
                    </Text>
                </Flex>
            </Flex>
            <Box>
                <Button
                    buttonText={'Go Back Home'}
                    isDisabled={false}
                    type={'solid'}
                    handleOnClick={() => router.push('/homePage')}
                />
                <Button
                    buttonText={'View Details'}
                    isDisabled={false}
                    type={'outline'}
                    handleOnClick={() => router.push('/orderDetails')}
                />
            </Box>
        </Box>
    )
}

export default OrderCancellation
