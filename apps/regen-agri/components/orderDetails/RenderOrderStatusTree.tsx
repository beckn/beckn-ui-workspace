import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { getOrderPlacementTimeline } from '../../utilities/confirm-utils'
import lineBlack from '../../public/images/lineBlack.svg'
import TrackIcon from '../../public/images/TrackIcon.svg'
import { useLanguage } from '../../hooks/useLanguage'

const orderStatusMap = {
    INITIATED: 'confirmationPending',
    ACKNOWLEDGED: 'itemsConfirmed',
    PACKED: 'orderPacked',
    SHIPPED: 'outForDelivery',
    DELIVERED: 'orderDelivered',
    Cancelled: 'Cancelled',
}

export const orderCardStatusMap = {
    INITIATED: 'pending',
    ACKNOWLEDGED: 'confirmed',
    PACKED: 'confirmed',
    SHIPPED: 'confirmed',
    DELIVERED: 'delivered',
}

export const RenderOrderStatusList = (res: any) => {
    const order = res.message.order
    const { t } = useLanguage()

    if (order.state === 'INITIATED') {
        return (
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
                            src={TrackIcon}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'15px'}
                            fontWeight={'600'}
                        >
                            {t[`${orderStatusMap['INITIATED']}`]}
                        </Text>
                    </Flex>
                    {order.fulfillment.tracking && (
                        <Text
                            fontSize={'15px'}
                            color={'rgba(var(--color-primary))'}
                        >
                            Track
                        </Text>
                    )}
                </Flex>
                <Flex>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                        src={lineBlack}
                        width={'12px'}
                        height={'40px'}
                    />
                    <Text
                        paddingLeft={'10px'}
                        fontSize={'10px'}
                        pt={'10px'}
                    >
                        {getOrderPlacementTimeline(res.context.timestamp)}
                    </Text>
                </Flex>
            </Box>
        )
    }
    if (order.state === 'ACKNOWLEDGED') {
        return (
            <>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['INITIATED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['ACKNOWLEDGED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
            </>
        )
    }
    if (order.state === 'PACKED') {
        return (
            <>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['INITIATED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['ACKNOWLEDGED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['PACKED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
            </>
        )
    }
    if (order.state === 'SHIPPED') {
        return (
            <>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['INITIATED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['ACKNOWLEDGED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['PACKED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['SHIPPED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
            </>
        )
    }
    if (order.state === 'DELIVERED') {
        return (
            <>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['INITIATED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['ACKNOWLEDGED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['PACKED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['SHIPPED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
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
                                src={TrackIcon}
                            />
                            <Text
                                paddingLeft={'10px'}
                                fontSize={'15px'}
                                fontWeight={'600'}
                            >
                                {t[`${orderStatusMap['DELIVERED']}`]}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image
                            src={lineBlack}
                            width={'12px'}
                            height={'40px'}
                        />
                        <Text
                            paddingLeft={'10px'}
                            fontSize={'10px'}
                            pt={'10px'}
                        >
                            {getOrderPlacementTimeline(res.context.timestamp)}
                        </Text>
                    </Flex>
                </Box>
            </>
        )
    }
}
