import React from 'react'
import { Text, Flex, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Button from '../button/Button'
import { useLanguage } from '../../hooks/useLanguage'

const EmptyPage = () => {
    const { t } = useLanguage()
    const router = useRouter()
    return (
        <Flex
            pt={'29px'}
            direction={'column'}
            align={'center'}
            gap={'6px'}
        >
            <Flex
                direction={'column'}
                mb={'20px'}
                gap={'6px'}
            >
                <Image
                    src={'/images/emptyPage.svg'}
                    alt={'empty page icon'}
                />

                <Text
                    mt={'20px'}
                    fontWeight="600"
                    fontSize={'15px'}
                    align={'center'}
                >
                    {t.emptyOrderHistoryText}
                </Text>
                <Text
                    fontWeight="400"
                    fontSize={'15px'}
                    align={'center'}
                >
                    {t.noExistingWorkflowText}
                </Text>
            </Flex>

            <Button
                buttonText={'Go Back Home'}
                isDisabled={false}
                type={'solid'}
                handleOnClick={() => {
                    router.push('/homePage')
                }}
            />
        </Flex>
    )
}

export default EmptyPage
