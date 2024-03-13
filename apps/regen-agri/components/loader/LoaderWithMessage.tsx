import { Box, Spinner, Text } from '@chakra-ui/react'
import React from 'react'

interface LoaderWithMessagePropsModel {
    loadingText: string
    loadingSubText: string
}

const LoaderWithMessage: React.FC<LoaderWithMessagePropsModel> = (props) => {
    const { loadingText = '', loadingSubText = '' } = props
    return (
        <div className="flex flex-col justify-center items-center h-[60vh]">
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#A71B4A"
                size="xl"
            ></Spinner>
            <Box
                mt={'13px'}
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
            >
                <Text
                    fontWeight={600}
                    fontSize={'17px'}
                >
                    {loadingText}
                </Text>
                <Text
                    textAlign={'center'}
                    fontWeight={400}
                    fontSize={'15px'}
                >
                    {loadingSubText}
                </Text>
            </Box>
        </div>
    )
}

export default React.memo(LoaderWithMessage)
