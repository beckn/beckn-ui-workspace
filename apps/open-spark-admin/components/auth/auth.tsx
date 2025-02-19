import React, { useState } from 'react'
import { Box, Checkbox, Flex, Text, Image, Link, border } from '@chakra-ui/react'
import { Button, GenericDropdown, Input, Loader, Typography } from '@beckn-ui/molecules'
import Styles from './auth.module.css'
import { AuthProps } from './auth.types'
import AuthDivider from './authDivider'

const Auth: React.FC<AuthProps> = ({ schema, isLoading, dataTestForm, customComponent }) => {
  const {
    logo,
    inputs,
    buttons,
    socialButtons,
    loader,
    chooseAuthType,
    handleAccountType,
    showTermsCheckbox = false,
    termsCheckboxProps,
    formName
  } = schema

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
      marginTop={{ base: '10px', md: '10px', lg: '10px' }}
    >
      {logo && logo.src && (
        <Box width={'100%'}>
          <Flex className={Styles.logo_container}>
            <Image
              className={Styles.logo_skillup}
              src={logo.src}
              alt={logo.alt}
              pt="15px"
              style={{
                width: '100%'
              }}
            />
            {logo?.description && (
              <Typography
                dataTest={'logo-description'}
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
      {formName && (
        <Flex
          flexDir={'row'}
          width="100%"
          whiteSpace="nowrap"
          alignItems="center"
          gap="0.5rem"
          marginTop={'1rem'}
        >
          <Box
            border={'1px solid #E2E2E2'}
            width="100%"
            height="0%"
          />
          <Typography
            text={formName}
            fontSize="10px"
            color="#7C7C7C"
          />
          <Box
            border={'1px solid #E2E2E2'}
            width="100%"
            height="0%"
          />
        </Flex>
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
            {chooseAuthType.map((authType, index) => (
              <Box
                key={index}
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
            pt="30px"
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
                      buttonStyles={{ marginBottom: '35px' }}
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
          {<>{customComponent}</>}
          {showTermsCheckbox && termsCheckboxProps && (
            <Flex
              mb="20px"
              className={Styles.auth_checkbox_container}
              flexDirection="column"
              alignItems="flex-start"
            >
              <Checkbox
                isChecked={termsCheckboxProps.isChecked}
                onChange={termsCheckboxProps.onChange}
                sx={{
                  '& .chakra-checkbox__control': {
                    border: '1px solid #141414',
                    borderRadius: '2px',
                    backgroundColor: '#FFFFFF',
                    w: '12px',
                    h: '12px'
                  },
                  '& .chakra-checkbox__control[data-checked]': {
                    backgroundColor: '#FFFFFF',
                    color: termsCheckboxProps.color,
                    border: '1px solid #141414',
                    borderRadius: '2px'
                  }
                }}
              >
                <Text
                  fontSize="12px"
                  fontWeight={400}
                >
                  I agree to the {termsCheckboxProps.termsText.serviceName}
                  <Link
                    ml={'5px'}
                    _hover={{ textDecoration: 'none' }}
                    href={termsCheckboxProps.termsText.termsLink}
                    isExternal
                    color={termsCheckboxProps.color}
                    fontSize={'12px'}
                    target="_blank"
                  >
                    Terms of Service
                  </Link>
                  <Text
                    as="span"
                    // display={['none', 'inline']}
                    fontSize="12px"
                    fontWeight={400}
                    ml="5px"
                  >
                    and
                  </Text>
                </Text>
                <Link
                  mt={['5px', '0']}
                  _hover={{ textDecoration: 'none' }}
                  href={termsCheckboxProps.termsText.privacyLink}
                  isExternal
                  color={termsCheckboxProps.color}
                  fontSize={'12px'}
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Checkbox>
            </Flex>
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
      </Flex>
    </Box>
  )
}

export default Auth
