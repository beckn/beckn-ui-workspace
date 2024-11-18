import React, { useState } from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'

// Custom
import { Button, GenericDropdown, Input, Loader, Typography } from '@beckn-ui/molecules'
import Styles from './auth.module.css'
import { AuthProps } from './auth.types'
import AuthDivider from './authDivider'
import greenTick from '../../../public/images/green-tick.svg'

const Auth: React.FC<AuthProps> = ({ schema, isLoading, dataTestForm }) => {
  const { logo, inputs, buttons, socialButtons, loader, chooseAuthType, handleAccountType } = schema

  const [accountType, setAccountType] = useState<string>('')

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
            {logo?.description && (
              <Typography
                text={logo?.description!}
                style={{
                  fontSize: '17px',
                  fontFamily: 'poppins',
                  color: '#564C4D',
                  fontWeight: '800',
                  alignSelf: 'center',
                  textAlign: 'center'
                }}
              />
            )}
          </Flex>
        </Box>
      )}
      <Flex
        flexDirection={'column'}
        width={'100%'}
      >
        {chooseAuthType && handleAccountType && chooseAuthType.length > 0 && (
          <Flex
            gap="2rem"
            alignSelf={'center'}
          >
            {chooseAuthType.map(authType => (
              <Box
                border={`1px solid ${accountType === authType.id ? '#00c347' : '#e2e8f0'}`}
                borderRadius="4px"
                padding="1rem"
                position={'relative'}
                onClick={() => {
                  setAccountType(authType.id)
                  handleAccountType(authType.id)
                }}
              >
                <Image
                  width={'5rem'}
                  height={'5rem'}
                  src={authType.src}
                  alt={authType.alt}
                />
                {accountType === authType.id && (
                  <Image
                    src={greenTick}
                    style={{
                      position: 'absolute',
                      bottom: '-14px',
                      left: '2.6rem',
                      width: '26px',
                      backgroundColor: '#fff'
                    }}
                  />
                )}
                {/* {accountType.label && <Typography text={accountType.label!} />} */}
              </Box>
            ))}
          </Flex>
        )}
        <Box
          width={'100%'}
          data-test={dataTestForm}
        >
          <Box
            className={Styles.signin_container}
            pt="40px"
          >
            <Box mt="10px">
              {inputs.map((singleInput, index) => {
                if (singleInput.type === 'select') {
                  return (
                    <GenericDropdown
                      key={index}
                      name={singleInput.name}
                      options={singleInput.options!}
                      placeholder={singleInput.label}
                      selectedValue={singleInput?.value || ''}
                      handleChange={singleInput.handleChange as any}
                      buttonStyles={{
                        marginBottom: '35px'
                      }}
                    />
                  )
                }
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
      </Flex>
    </Box>
  )
}

export default Auth
