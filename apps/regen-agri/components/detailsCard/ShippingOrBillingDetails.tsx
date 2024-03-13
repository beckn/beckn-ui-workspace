import React from 'react'
import {
    Flex,
    Image,
    Text,
    Stack,
    StackDivider,
    Box,
    CardBody,
} from '@chakra-ui/react'
import CallphoneIcon from '../../public/images/CallphoneIcon.svg'
import locationIcon from '../../public/images/locationIcon.svg'
import nameIcon from '../../public/images/nameIcon.svg'
import Accordion from '../accordion/Accordion'

export interface ShippingOrBillingDetailsProps {
    name: string
    location: string
    number: number | string
    accordionHeader: string
}

const ShippingOrBillingDetails: React.FC<ShippingOrBillingDetailsProps> = (
    props
) => {
    return (
        <Accordion accordionHeader={props.accordionHeader}>
            <CardBody
                pt={'unset'}
                pb={'15px'}
            >
                <Box>
                    <Stack
                        divider={<StackDivider />}
                        spacing="4"
                    >
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image
                                src={nameIcon}
                                pr={'12px'}
                            />
                            <Text fontSize={'15px'}>{props.name}</Text>
                        </Flex>
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image
                                src={locationIcon}
                                pr={'12px'}
                            />
                            <Text fontSize={'15px'}>{props.location}</Text>
                        </Flex>
                        <Flex alignItems={'center'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image
                                src={CallphoneIcon}
                                pr={'12px'}
                            />
                            <Text fontSize={'15px'}>{props.number}</Text>
                        </Flex>
                    </Stack>
                </Box>
            </CardBody>
        </Accordion>
    )
}

export default ShippingOrBillingDetails
