import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'

// Custom
import { Button, Input } from '@beckn-ui/molecules'
import Styles from './auth.module.css'
import { AuthProps } from './auth.types'
import AuthDivider from './authDivider'

const Auth: React.FC<AuthProps> = ({ schema }) => {
  const { logo, inputs, buttons, socialButtons } = schema

  return (
    <Box
      className={Styles.main_container}
      display="flex"
      marginTop={{ base: '10px', md: '60px', lg: '70px' }}
    >
      {logo && logo.src && (
        <Box width={'100%'}>
          <Flex className={Styles.logo_container}>
            <Image
              className={Styles.logo_skillup}
              src={logo.src}
              alt={logo.alt}
              pt="15px"
            />
          </Flex>
        </Box>
      )}
      <Box width={'100%'}>
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
              className={Styles.auth_btn}
              key={singleButton.text}
              {...singleButton}
            />
          )
        })}
        {socialButtons && socialButtons.length > 0 && (
          <>
            <AuthDivider />
            {socialButtons?.map(singleButton => {
              return (
                <Button
                  className={Styles.auth_btn}
                  key={singleButton.text}
                  {...singleButton}
                />
              )
            })}
          </>
        )}
      </Box>
    </Box>
  )
}

export default Auth
