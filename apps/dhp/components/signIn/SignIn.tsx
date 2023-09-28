// 'use client'
import React from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import HomeImg from '../../public/images/HomePageLogo.svg'
import GeneHealLogo from '../../public/images/GeneHealLogo.svg'
import Styles from './SignIn.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import GoogleLogo from '../../public/images/Google_logo.svg'
import { SignInPropsModel } from './Signin.types'

const SignIn: React.FC<SignInPropsModel> = props => {
  const { t } = useLanguage()
  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.logo_container}>
        <Image src={HomeImg} alt="Home Icon" width={77} height={76} />
        <Image className={Styles.logo_skillup} src={GeneHealLogo} alt="Skill Up Icon" width={188} height={56} />
      </Flex>
      <Box className={Styles.signin_container}>
        <Flex className={Styles.signin}>
          <Text className={Styles.signIn_text}>{t.signInText}</Text>
          <Button
            onClick={props.buttonClickHandler}
            className={Styles.signin_button}
            pt={'25px'}
            pb={'25px'}
            borderRadius={'12px'}
          >
            <Flex className={Styles.signin_button_conatiner}>
              <Image src={GoogleLogo} className={Styles.google_icon} alt="google signin" width={16} height={16} />
              <Text className={Styles.signin_button_text}>{t.googleSignInText}</Text>
            </Flex>
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default SignIn
