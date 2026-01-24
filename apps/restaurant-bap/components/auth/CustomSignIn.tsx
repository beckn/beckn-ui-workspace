import React, { useState } from 'react'
import {
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

interface CustomSignInProps {
  onSignIn: (email: string, password: string) => void
  onSignUp: () => void
  isLoading?: boolean
}

const CustomSignIn: React.FC<CustomSignInProps> = ({ onSignIn, onSignUp, isLoading = false }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const toast = useToast()

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Email is required'
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email'
    }
    return undefined
  }

  const validatePassword = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Password is required'
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return undefined
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    // Clear general error when user types
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
    // Validate email in real-time
    const error = validateEmail(value)
    setErrors(prev => ({ ...prev, email: error }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    // Clear general error when user types
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
    // Validate password in real-time
    const error = validatePassword(value)
    setErrors(prev => ({ ...prev, password: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('Form submitted with:', { email, password: '***' })

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      })
      return
    }

    // Clear any previous errors
    setErrors({})

    // If validation passes, call onSignIn with email and password
    try {
      onSignIn(email, password)
    } catch (error) {
      console.error('Sign in error:', error)
      setErrors({
        general: 'An error occurred during sign in. Please try again.'
      })
    }
  }

  // Form is valid if both fields have values and no validation errors
  const emailValid = email.trim().length > 0 && validateEmail(email) === undefined
  const passwordValid = password.trim().length > 0 && validatePassword(password) === undefined
  const isFormValid = emailValid && passwordValid

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      w="100%"
    >
      <FormControl
        mb="24px"
        isInvalid={!!errors.email}
      >
        <FormLabel
          fontSize="14px"
          fontWeight="600"
          color="gray.700"
          mb="8px"
        >
          Email
        </FormLabel>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          size="lg"
          borderRadius="12px"
          border="1px solid"
          borderColor="gray.300"
          _focus={{
            borderColor: '#FF6B35',
            boxShadow: '0 0 0 1px #FF6B35'
          }}
          _hover={{
            borderColor: 'gray.400'
          }}
        />
        {errors.email && (
          <FormErrorMessage
            mt="4px"
            fontSize="12px"
          >
            {errors.email}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        mb="32px"
        isInvalid={!!errors.password}
      >
        <FormLabel
          fontSize="14px"
          fontWeight="600"
          color="gray.700"
          mb="8px"
        >
          Password
        </FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            size="lg"
            borderRadius="12px"
            border="1px solid"
            borderColor="gray.300"
            _focus={{
              borderColor: '#FF6B35',
              boxShadow: '0 0 0 1px #FF6B35'
            }}
            _hover={{
              borderColor: 'gray.400'
            }}
            pr="50px"
          />
          <InputRightElement
            h="100%"
            pr="12px"
          >
            <IconButton
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              color="gray.500"
              _hover={{ bg: 'transparent', color: '#FF6B35' }}
            />
          </InputRightElement>
        </InputGroup>
        {errors.password && (
          <FormErrorMessage
            mt="4px"
            fontSize="12px"
          >
            {errors.password}
          </FormErrorMessage>
        )}
      </FormControl>

      {errors.general && (
        <Box
          mb="20px"
          p="12px"
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="8px"
        >
          <Text
            fontSize="14px"
            color="red.600"
            textAlign="center"
          >
            {errors.general}
          </Text>
        </Box>
      )}

      <Button
        type="submit"
        w="100%"
        size="lg"
        bg="#FF6B35"
        color="white"
        borderRadius="12px"
        fontWeight="600"
        fontSize="16px"
        mb="16px"
        _hover={{
          bg: '#E55A2B'
        }}
        _active={{
          bg: '#D14A1B'
        }}
        _disabled={{
          bg: 'gray.300',
          color: 'gray.500',
          cursor: 'not-allowed',
          opacity: 0.6
        }}
        isDisabled={!isFormValid || isLoading}
        isLoading={isLoading}
        loadingText="Signing in..."
      >
        Sign In
      </Button>

      <Button
        type="button"
        w="100%"
        size="lg"
        variant="outline"
        borderColor="gray.300"
        color="gray.700"
        borderRadius="12px"
        fontWeight="600"
        fontSize="16px"
        _hover={{
          bg: 'gray.50',
          borderColor: '#FF6B35',
          color: '#FF6B35'
        }}
        onClick={onSignUp}
        isDisabled={isLoading}
      >
        Sign Up
      </Button>
    </Box>
  )
}

export default CustomSignIn
