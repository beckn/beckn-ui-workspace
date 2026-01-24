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
  IconButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

interface CustomSignUpProps {
  onSignUp: (name: string, email: string, password: string, mobile?: string) => void
  onSignIn: () => void
  isLoading?: boolean
}

const CustomSignUp: React.FC<CustomSignUpProps> = ({ onSignUp, onSignIn, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Name is required'
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters'
    }
    return undefined
  }

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

  const validateConfirmPassword = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Please confirm your password'
    }
    if (value !== formData.password) {
      return 'Passwords do not match'
    }
    return undefined
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      const error =
        field === 'name'
          ? validateName(value)
          : field === 'email'
            ? validateEmail(value)
            : field === 'password'
              ? validatePassword(value)
              : validateConfirmPassword(value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('Sign up form submitted with:', {
      name: formData.name,
      email: formData.email,
      password: '***'
    })

    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword)

    if (nameError || emailError || passwordError || confirmPasswordError) {
      console.log('Validation errors:', { nameError, emailError, passwordError, confirmPasswordError })
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      })
      return
    }

    // Clear any previous errors
    setErrors({})

    // If validation passes, call onSignUp with name, email, and password
    try {
      onSignUp(formData.name.trim(), formData.email.trim(), formData.password.trim())
    } catch (error) {
      console.error('Sign up error:', error)
      setErrors({
        general: 'An error occurred during sign up. Please try again.'
      })
    }
  }

  // Form is valid if all fields have values and no validation errors
  const nameValid = formData.name.trim().length > 0 && validateName(formData.name) === undefined
  const emailValid = formData.email.trim().length > 0 && validateEmail(formData.email) === undefined
  const passwordValid = formData.password.trim().length > 0 && validatePassword(formData.password) === undefined
  const confirmPasswordValid =
    formData.confirmPassword.trim().length > 0 && validateConfirmPassword(formData.confirmPassword) === undefined

  const isFormValid = nameValid && emailValid && passwordValid && confirmPasswordValid

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      w="100%"
    >
      <FormControl
        mb="20px"
        isInvalid={!!errors.name}
      >
        <FormLabel
          fontSize="14px"
          fontWeight="600"
          color="gray.700"
          mb="8px"
        >
          Full Name
        </FormLabel>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Enter your full name"
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
        {errors.name && (
          <FormErrorMessage
            mt="4px"
            fontSize="12px"
          >
            {errors.name}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        mb="20px"
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
          value={formData.email}
          onChange={handleChange('email')}
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
        mb="20px"
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
            value={formData.password}
            onChange={handleChange('password')}
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

      <FormControl
        mb="28px"
        isInvalid={!!errors.confirmPassword}
      >
        <FormLabel
          fontSize="14px"
          fontWeight="600"
          color="gray.700"
          mb="8px"
        >
          Confirm Password
        </FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Confirm your password"
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
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              color="gray.500"
              _hover={{ bg: 'transparent', color: '#FF6B35' }}
            />
          </InputRightElement>
        </InputGroup>
        {errors.confirmPassword && (
          <FormErrorMessage
            mt="4px"
            fontSize="12px"
          >
            {errors.confirmPassword}
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
        loadingText="Creating account..."
      >
        Sign Up
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
        onClick={onSignIn}
        isDisabled={isLoading}
      >
        Already have an account? Sign In
      </Button>
    </Box>
  )
}

export default CustomSignUp
