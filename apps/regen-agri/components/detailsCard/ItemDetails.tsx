import React from 'react'
import { Text, Box, Flex, Divider } from '@chakra-ui/react'

export interface ItemDetailProps {
    title: string
    description: string
    quantity: number
    price: string
}

const ItemDetails: React.FC<ItemDetailProps> = (props) => {
    return (
        <>
            <Box pb={'10px'}>
                <Flex
                    pb={'5px'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <Text fontSize={'15px'}>{props.title}</Text>{' '}
                    <Text fontSize={'12px'}>x{props.quantity}</Text>
                </Flex>
                <Flex
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <Text fontSize={'12px'}>{props.title}</Text>

                    <Text
                        color={'rgba(var(--color-primary))'}
                        fontSize={'15px'}
                    >
                        {props.price}
                    </Text>
                </Flex>
            </Box>
            <Divider mb={'15px'} />
        </>
    )
}

export default ItemDetails
