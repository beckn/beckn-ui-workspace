import { Text, Stack, Image, Divider, Flex, Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AppHeader } from '../components/appHeader/AppHeader'
import { useLanguage } from '../hooks/useLanguage'
import trackOrderMap from '../public/images/trackOrderMap.svg'
import orderConfirmed from '../public/images/orderConfirmed.svg'
import deliveryAgentBlack from '../public/images/deliveryAgentBlack.svg'
import deliveryAgentRed from '../public/images/deliveryAgentRed.svg'
import ofdRed from '../public/images/ofdRed.svg'
import ofdBlack from '../public/images/ofdBlack.svg'
import orderDeliveredRed from '../public/images/orderDeliveredRed.svg'
import orderDeliveredBlack from '../public/images/orderDeliveredBlack.svg'
import lineRed from '../public/images/lineRed.svg'
import lineBlack from '../public/images/lineBlack.svg'

const TrackOrder = () => {
    const [activeSteps, setActiveSteps] = useState([true, false, false, false])
    const { t } = useLanguage()
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSteps((prevSteps) => {
                const updatedSteps = [...prevSteps]
                const nextActiveIndex = prevSteps.findIndex(
                    (isActive) => !isActive
                )
                if (nextActiveIndex !== -1) {
                    updatedSteps[nextActiveIndex] = true
                }
                return updatedSteps
            })
        }, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const getStepColor = (stepIndex: number) => {
        return activeSteps[stepIndex] ? 'rgba(var(--color-primary))' : '#000000'
    }

    const getStepImage = (stepIndex: number) => {
        switch (stepIndex) {
            case 0:
                return orderConfirmed
            case 1:
                return activeSteps[1] ? deliveryAgentRed : deliveryAgentBlack
            case 2:
                return activeSteps[2] ? ofdRed : ofdBlack
            case 3:
                return activeSteps[3] ? orderDeliveredRed : orderDeliveredBlack
            case 4:
                return router.push('/feedback')
            default:
                return null
        }
    }

    const getStepLineImage = (stepIndex: number) => {
        return activeSteps[stepIndex] ? lineRed : lineBlack
    }

    useEffect(() => {
        const isAllStepsCompleted = activeSteps.every((isActive) => isActive)

        if (isAllStepsCompleted) {
            router.push('/feedback')
        }
    }, [activeSteps, router])

    return (
        <>
            {/* <AppHeader appHeaderText={t.trackOrder} /> */}
            <Stack marginBottom={'50px'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                    src={trackOrderMap}
                    margin={'0 auto'}
                />
            </Stack>
            <Stack>
                <Text>
                    {t.orderId}
                    <Text
                        as={'span'}
                        color={'rgba(var(--color-primary))'}
                    >
                        456789120
                    </Text>
                </Text>
                <Text fontSize={'12px'}>
                    {t.estimatedDelivery} 21st Jun 2021, 12:21pm
                </Text>
            </Stack>
            <Divider
                ml={'-20px'}
                mr={'-20px'}
                pb={'20px'}
                width={'unset'}
                borderColor={'#D3D3D3'}
            />
            <Box mt={'30px'}>
                <Box>
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image
                                width={'12px'}
                                height={'13px'}
                                src={getStepImage(0)}
                            />
                            <Text
                                color={getStepColor(0)}
                                paddingLeft={'7px'}
                                fontSize={'12px'}
                            >
                                {t.orderConfirmed}
                            </Text>
                        </Flex>
                        <Text
                            color={getStepColor(0)}
                            fontSize={'12px'}
                        >
                            {t.orderConfirmedTime}
                        </Text>
                    </Flex>
                    <Flex paddingTop={'12px'}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={getStepLineImage(0)}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'7px'}
                            fontSize={'10px'}
                        >
                            {t.orderConfirmedMssg}
                        </Text>
                    </Flex>
                </Box>
                <Box paddingTop={'15px'}>
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image
                                width={'12px'}
                                height={'13px'}
                                src={getStepImage(1)}
                            />
                            <Text
                                paddingLeft={'7px'}
                                fontSize={'12px'}
                                color={getStepColor(1)}
                            >
                                {t.agentAssigned}
                            </Text>
                        </Flex>
                        <Text
                            color={getStepColor(0)}
                            fontSize={'12px'}
                        >
                            {activeSteps[1] ? t.agentAssignedTime : null}
                        </Text>
                    </Flex>
                    <Flex paddingTop={'12px'}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={getStepLineImage(1)}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'7px'}
                            fontSize={'10px'}
                        >
                            {activeSteps[1] ? t.agentAssignedMssg : '--'}
                        </Text>
                    </Flex>
                </Box>
                <Box paddingTop={'15px'}>
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image src={getStepImage(2)} />
                            <Text
                                paddingLeft={'7px'}
                                fontSize={'12px'}
                                color={getStepColor(2)}
                            >
                                {t.OFD}
                            </Text>
                        </Flex>
                        <Text
                            color={getStepColor(0)}
                            fontSize={'12px'}
                        >
                            {activeSteps[2] ? t.OFDTime : null}
                        </Text>
                    </Flex>
                    <Flex paddingTop={'12px'}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={getStepLineImage(2)}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'7px'}
                            fontSize={'10px'}
                        >
                            {activeSteps[2] ? t.OFDMssg : '--'}
                        </Text>
                    </Flex>
                </Box>
                <Box paddingTop={'15px'}>
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image
                                width={'12px'}
                                height={'13px'}
                                src={getStepImage(3)}
                            />
                            <Text
                                paddingLeft={'7px'}
                                fontSize={'12px'}
                                color={getStepColor(3)}
                            >
                                {t.orderDelivered}
                            </Text>
                        </Flex>
                        <Text
                            color={getStepColor(0)}
                            fontSize={'12px'}
                        >
                            {activeSteps[3] ? t.orderDeliveredTime : null}
                        </Text>
                    </Flex>
                    <Flex paddingTop={'12px'}>
                        <Text width={'12px'}></Text>
                        <Text
                            paddingLeft={'7px'}
                            fontSize={'10px'}
                        >
                            {activeSteps[3] ? t.orderDeliveredMssg : '--'}
                        </Text>
                    </Flex>
                </Box>
            </Box>
        </>
    )
}

export default TrackOrder
