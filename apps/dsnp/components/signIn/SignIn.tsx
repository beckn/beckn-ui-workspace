// 'use client'
import React from 'react'
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react'
import OpenCommerce from '../../public/images/openCommerce.svg'
import Styles from './SignIn.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { FaGoogle } from 'react-icons/fa'

const SignIn: React.FC<SignInPropsModel> = props => {
  const { t } = useLanguage()
  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.logo_container}>
        <Image className={Styles.logo_skillup} src={OpenCommerce} alt="OpenCommerce" pt="15px" />
      </Flex>
      <Box className={Styles.signin_container}>
        <Flex className={Styles.signin}>
          <Text className={Styles.signIn_text}>{t('loginToYourAccount')}</Text>
          <Button
            onClick={props.buttonClickHandler}
            className={Styles.signin_button}
            pt={'25px'}
            pb={'25px'}
            mt={'35px'}
            borderRadius={'12px'}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
          >
            <Flex className={Styles.signin_button_conatiner}>
              <FaGoogle style={{ position: 'relative', right: '4rem' }} color="white" size={16} />
              <Text className={Styles.signin_button_text}>{t('signInWithGamail')}</Text>
            </Flex>
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default SignIn
