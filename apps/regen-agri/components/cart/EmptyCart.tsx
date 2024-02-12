import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import CartEmpty from '../../public/images/CartEmpty.svg'
import Styles from './EmptyCart.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'
import Router from 'next/router'

const EmptyCart: React.FC = () => {
    const { t } = useLanguage()
    const handleGoBack = (): void => {
        Router.push('/homePage')
    }

    return (
        <Flex className={Styles.emptyCart_container}>
            <Box
                mb={'40px'}
                display={'flex'}
                justifyContent={'center'}
            >
                <Image
                    src={CartEmpty}
                    width={'306px'}
                    height={'245px'}
                    alt="cartEmpty"
                />
            </Box>
            <Text className={Styles.cartHeadingText}>{t.cartEmpty}</Text>
            <Text className={Styles.cartSpanText}>{t.cartEmptySpan}</Text>
            <Button
                buttonText={t.shopButton}
                type={'solid'}
                isDisabled={false}
                handleOnClick={handleGoBack}
            />
        </Flex>
    )
}

export default EmptyCart
