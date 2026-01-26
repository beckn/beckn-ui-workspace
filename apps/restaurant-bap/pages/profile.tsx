import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Divider,
  Flex,
  IconButton,
  useToast,
  SimpleGrid
} from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { FiArrowLeft, FiUser, FiPhone, FiMail, FiMapPin, FiHome, FiSave, FiEdit2 } from 'react-icons/fi'
import Cookies from 'js-cookie'
// TODO: Uncomment when using real API
// import axios from '@services/axios'

interface ProfileFormData {
  name: string
  mobileNumber: string
  email: string
  flatNumber: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface FormErrors {
  name?: string
  mobileNumber?: string
  email?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

const Profile = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    mobileNumber: '',
    email: '',
    flatNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Load profile data
  useEffect(() => {
    setIsLoading(true)

    // Try to load from localStorage first (for POC)
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile))
    } else {
      // Set default values from session
      const userName = localStorage.getItem('userName') || ''
      const userEmail = localStorage.getItem('userEmail') || ''
      const userPhone = localStorage.getItem('userPhone') || ''

      setFormData(prev => ({
        ...prev,
        name: userName,
        email: userEmail,
        mobileNumber: userPhone
      }))
    }

    // TODO: Uncomment when using real API
    // const bearerToken = Cookies.get('authToken')
    // const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    // axios.get(`${strapiUrl}/profiles`, {
    //   headers: { Authorization: `Bearer ${bearerToken}` }
    // }).then(response => {
    //   const { name, phone, address, zip_code } = response.data.data.attributes
    //   // Parse address and set form data
    // })

    setIsLoading(false)
  }, [])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'Enter valid 10-digit number'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter valid email'
    }

    if (formData.zipCode && !/^\d{6}$/.test(formData.zipCode)) {
      errors.zipCode = 'Enter valid 6-digit PIN code'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSave = () => {
    if (!validateForm()) return

    setIsLoading(true)

    // Save to localStorage for POC
    localStorage.setItem('userProfile', JSON.stringify(formData))
    localStorage.setItem('userName', formData.name)
    localStorage.setItem('userEmail', formData.email)
    localStorage.setItem('userPhone', formData.mobileNumber)

    // Build address for shipping
    const fullAddress = [
      formData.flatNumber,
      formData.street,
      formData.city,
      formData.state,
      formData.country,
      formData.zipCode
    ]
      .filter(Boolean)
      .join(', ')

    if (fullAddress) {
      localStorage.setItem(
        'shippingAdress',
        JSON.stringify({
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          address: fullAddress,
          pinCode: formData.zipCode
        })
      )
    }

    // TODO: Uncomment when using real API
    // const bearerToken = Cookies.get('authToken')
    // const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    // const data = {
    //   name: formData.name,
    //   phone: formData.mobileNumber,
    //   address: fullAddress,
    //   zip_code: formData.zipCode
    // }
    // axios.post(`${strapiUrl}/profiles`, data, {
    //   headers: { Authorization: `Bearer ${bearerToken}` }
    // })

    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Success',
            display: true,
            type: 'success',
            description: 'Profile updated successfully'
          }
        })
      )
    }, 500)
  }

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== '' && formData.mobileNumber.trim() !== '' && Object.values(formErrors).every(err => !err)
    )
  }, [formData, formErrors])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py={{ base: '16px', md: '40px' }}
    >
      <Container
        maxW="800px"
        px={{ base: '16px', md: '24px' }}
      >
        {/* Header */}
        <Flex
          align="center"
          mb={{ base: '20px', md: '32px' }}
        >
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft size="28px" />}
            variant="ghost"
            mr="12px"
            onClick={() => router.back()}
            size="lg"
          />
          <Text
            fontSize={{ base: '24px', md: '32px' }}
            fontWeight="700"
            color="gray.800"
          >
            {t.profile || 'My Profile'}
          </Text>
        </Flex>

        {/* Profile Card */}
        <Box
          bg="white"
          borderRadius={{ base: '16px', md: '20px' }}
          overflow="hidden"
          boxShadow="0 2px 12px rgba(0,0,0,0.08)"
        >
          {/* Profile Header */}
          <Box
            bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
            py={{ base: '24px', md: '40px' }}
            px={{ base: '20px', md: '32px' }}
            textAlign="center"
          >
            <Avatar
              size={{ base: 'xl', md: '2xl' }}
              name={formData.name || 'User'}
              bg="white"
              color="#FF6B35"
              fontSize={{ base: '28px', md: '36px' }}
              fontWeight="700"
              mb="16px"
              border="4px solid white"
              boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            >
              {formData.name ? getInitials(formData.name) : <FiUser size="40px" />}
            </Avatar>
            <Text
              fontSize={{ base: '20px', md: '24px' }}
              fontWeight="700"
              color="white"
              mb="4px"
            >
              {formData.name || 'Add Your Name'}
            </Text>
            <Text
              fontSize={{ base: '14px', md: '16px' }}
              color="whiteAlpha.900"
            >
              {formData.email || formData.mobileNumber || 'Complete your profile'}
            </Text>
          </Box>

          {/* Form Section */}
          <Box p={{ base: '20px', md: '32px' }}>
            <Flex
              justify="space-between"
              align="center"
              mb="24px"
            >
              <Text
                fontSize={{ base: '18px', md: '20px' }}
                fontWeight="700"
                color="gray.800"
              >
                Personal Information
              </Text>
              {!isEditing && (
                <Button
                  leftIcon={<FiEdit2 />}
                  variant="outline"
                  colorScheme="orange"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </Flex>

            <VStack
              spacing="20px"
              align="stretch"
            >
              {/* Name & Phone */}
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing="20px"
              >
                <FormControl isInvalid={!!formErrors.name}>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    <HStack spacing="8px">
                      <FiUser />
                      <Text>Full Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                  <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!formErrors.mobileNumber}>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    <HStack spacing="8px">
                      <FiPhone />
                      <Text>Phone Number</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    type="tel"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                  <FormErrorMessage>{formErrors.mobileNumber}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              {/* Email */}
              <FormControl isInvalid={!!formErrors.email}>
                <FormLabel
                  fontSize="14px"
                  color="gray.600"
                >
                  <HStack spacing="8px">
                    <FiMail />
                    <Text>Email Address</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  type="email"
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                  borderRadius="12px"
                  size="lg"
                  _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>

              <Divider my="8px" />

              <Text
                fontSize={{ base: '18px', md: '20px' }}
                fontWeight="700"
                color="gray.800"
              >
                <HStack spacing="8px">
                  <FiMapPin />
                  <Text>Address</Text>
                </HStack>
              </Text>

              {/* Flat & Street */}
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing="20px"
              >
                <FormControl>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    <HStack spacing="8px">
                      <FiHome />
                      <Text>Flat / House No.</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="flatNumber"
                    value={formData.flatNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 123, Tower A"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    Street / Area
                  </FormLabel>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="e.g., MG Road"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                </FormControl>
              </SimpleGrid>

              {/* City & State */}
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing="20px"
              >
                <FormControl>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    City
                  </FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Bengaluru"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    State
                  </FormLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g., Karnataka"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                </FormControl>
              </SimpleGrid>

              {/* ZIP & Country */}
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing="20px"
              >
                <FormControl isInvalid={!!formErrors.zipCode}>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    PIN Code
                  </FormLabel>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="e.g., 560001"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                  <FormErrorMessage>{formErrors.zipCode}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="14px"
                    color="gray.600"
                  >
                    Country
                  </FormLabel>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g., India"
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    borderRadius="12px"
                    size="lg"
                    _focus={{ borderColor: '#FF6B35', boxShadow: '0 0 0 1px #FF6B35' }}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Save Button */}
              {isEditing && (
                <HStack
                  spacing="16px"
                  pt="16px"
                >
                  <Button
                    flex="1"
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    borderRadius="12px"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    flex="2"
                    bg="#FF6B35"
                    color="white"
                    size="lg"
                    borderRadius="12px"
                    leftIcon={<FiSave />}
                    onClick={handleSave}
                    isLoading={isLoading}
                    isDisabled={!isFormValid}
                    _hover={{ bg: '#E55A2B' }}
                    _active={{ bg: '#CC4F24' }}
                  >
                    Save Profile
                  </Button>
                </HStack>
              )}
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Profile
