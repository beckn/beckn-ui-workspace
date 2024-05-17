import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { testIds } from '@shared/dataTestIds'

// Custom
import { Button, Input, Loader, Typography } from '@beckn-ui/molecules'
import Styles from './auth.module.css'
import { AuthProps } from './auth.types'
import AuthDivider from './authDivider'

const Auth: React.FC<AuthProps> = ({ schema, isLoading }) => {
  const { logo, inputs, buttons, socialButtons, loader } = schema

  if (isLoading) {
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        transform="translateY(-20%)"
      >
        <Loader {...loader} />
      </Box>
    )
  }

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
      <Box
        width={'100%'}
        data-test={testIds.profile_form}
      >
        <Box
          className={Styles.signin_container}
          pt="40px"
        >
          <Box mt="10px">
            {inputs.map((singleInput, index) => {
              return (
                <Input
                  dataTest={singleInput.dataTest}
                  key={index}
                  {...singleInput}
                />
              )
            })}
          </Box>
        </Box>
        {schema.forgotPassword && (
          <Box
            width={'100%'}
            mb="20px"
          >
            <Typography
              className={Styles.typography_text}
              {...schema.forgotPassword}
            />
          </Box>
        )}
        {buttons.map(singleButton => {
          return (
            <Button
              dataTest={singleButton.dataTest}
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
