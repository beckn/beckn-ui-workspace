import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'

// Custom
import { InputProps, ButtonProps } from '@beckn-ui/molecules'
import { Button, Input } from '@beckn-ui/molecules'
import Styles from './auth.module.css'

export interface AuthProps {
  schema: {
    logo: {
      src: string
      alt: string
    }
    inputs: InputProps[]
    buttons: ButtonProps[]
  }
}

const Auth: React.FC<AuthProps> = ({ schema }) => {
  const { logo, inputs, buttons } = schema

  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.logo_container}>
        <Image
          className={Styles.logo_skillup}
          src={logo.src}
          alt={logo.alt}
          pt="15px"
        />
      </Flex>
      <Box
        className={Styles.signin_container}
        pt="40px"
      >
        <Box mt="10px">
          {inputs.map((singleInput, index) => {
            return (
              <Input
                key={index}
                {...singleInput}
              />
            )
          })}
        </Box>
      </Box>
      {buttons.map(singleButton => {
        return (
          <Button
            key={singleButton.text}
            {...singleButton}
          />
        )
      })}
    </Box>
  )
}

export default Auth
