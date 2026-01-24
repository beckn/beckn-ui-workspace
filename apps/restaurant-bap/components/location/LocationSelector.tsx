import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  HStack,
  useDisclosure,
  Skeleton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { FiMapPin, FiChevronDown, FiSearch, FiX, FiNavigation } from 'react-icons/fi'
import { useGeolocation, IGeoLocationSearchPageRootState } from '@beckn-ui/common'
import { useSelector, useDispatch } from 'react-redux'
import { setGeoAddressAndLatLong } from '@beckn-ui/common/src/store/geoMapLocationSearch-slice'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

interface LocationSelectorProps {
  variant?: 'header' | 'compact'
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ variant = 'header' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()
  const [searchAddress, setSearchAddress] = useState('')
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const { currentAddress, loading: loadingCurrentLocation } = useGeolocation(apiKeyForGoogle as string)

  // Get saved location from Redux
  const savedGeoAddress = useSelector((state: any) => state.geoLocationSearchPageUI?.geoAddress || '')

  const displayAddress = savedGeoAddress || currentAddress || 'Select Location'

  // Check if Google Maps is loaded with retry
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 10

    const checkGoogleMaps = () => {
      if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
        setIsGoogleLoaded(true)
        return true
      }
      return false
    }

    // Check immediately
    if (checkGoogleMaps()) return

    // Retry with interval
    const interval = setInterval(() => {
      retryCount++
      if (checkGoogleMaps() || retryCount >= maxRetries) {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [isOpen]) // Re-check when modal opens

  const handleSelect = async (address: string) => {
    try {
      const results = await geocodeByAddress(address)
      const latLng = await getLatLng(results[0])

      // Get country from address components
      const countryComponent = results[0].address_components.find((component: any) =>
        component.types.includes('country')
      )
      const country = countryComponent?.long_name || ''

      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: address,
          country: country,
          geoLatLong: `${latLng.lat},${latLng.lng}`
        })
      )
      setSearchAddress('')
      onClose()
    } catch (error) {
      console.error('Error selecting address:', error)
    }
  }

  const handleUseCurrentLocation = () => {
    if (currentAddress) {
      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: currentAddress,
          country: '',
          geoLatLong: ''
        })
      )
      onClose()
    }
  }

  const truncateAddress = (address: string, maxLength: number = 25) => {
    if (!address) return 'Select Location'
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address
  }

  return (
    <>
      {/* Location Display Button */}
      <Flex
        align="center"
        cursor="pointer"
        onClick={onOpen}
        bg="transparent"
        px="0"
        py="0"
        borderRadius="8px"
        _hover={{ opacity: 0.8 }}
        transition="all 0.2s"
        w="100%"
      >
        <Box
          color="#FF6B35"
          mr="8px"
          display="flex"
          alignItems="center"
          flexShrink={0}
        >
          <FiMapPin size="18px" />
        </Box>
        <VStack
          spacing="0"
          align="start"
          flex="1"
          minW="0"
        >
          <Text
            fontSize="10px"
            color="gray.500"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.5px"
            lineHeight="1.2"
          >
            DELIVER TO
          </Text>
          {loadingCurrentLocation ? (
            <Skeleton
              height="14px"
              width="120px"
              mt="2px"
            />
          ) : (
            <Text
              fontSize="13px"
              fontWeight="600"
              color="gray.800"
              noOfLines={1}
              maxW="100%"
              mt="2px"
            >
              {truncateAddress(displayAddress, 30)}
            </Text>
          )}
        </VStack>
        <Box
          color="gray.400"
          ml="8px"
          flexShrink={0}
        >
          <FiChevronDown size="16px" />
        </Box>
      </Flex>

      {/* Location Selection Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          borderRadius="20px"
          mx="16px"
          maxH="80vh"
          overflow="hidden"
        >
          <ModalHeader
            borderBottom="1px solid"
            borderColor="gray.100"
            pb="16px"
          >
            <Flex
              align="center"
              gap="12px"
            >
              <Box
                bg="#FFF5F2"
                p="10px"
                borderRadius="12px"
                color="#FF6B35"
              >
                <FiMapPin size="20px" />
              </Box>
              <Box>
                <Text
                  fontSize="18px"
                  fontWeight="700"
                  color="gray.800"
                >
                  Select Delivery Location
                </Text>
                <Text
                  fontSize="12px"
                  color="gray.500"
                  fontWeight="400"
                >
                  Choose where you want your food delivered
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton
            top="20px"
            right="20px"
          />

          <ModalBody
            py="20px"
            px="20px"
          >
            <VStack
              spacing="16px"
              align="stretch"
            >
              {/* Use Current Location Button */}
              <Flex
                align="center"
                p="14px"
                bg="linear-gradient(135deg, #FFF5F2 0%, #FFF9F7 100%)"
                borderRadius="12px"
                cursor="pointer"
                onClick={handleUseCurrentLocation}
                border="1px dashed"
                borderColor="#FF6B35"
                _hover={{
                  bg: 'linear-gradient(135deg, #FFEDE8 0%, #FFF5F2 100%)',
                  transform: 'translateY(-1px)'
                }}
                transition="all 0.2s"
              >
                <Box
                  bg="#FF6B35"
                  p="8px"
                  borderRadius="full"
                  color="white"
                  mr="12px"
                >
                  <FiNavigation size="16px" />
                </Box>
                <Box flex="1">
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="#FF6B35"
                  >
                    Use Current Location
                  </Text>
                  <Text
                    fontSize="11px"
                    color="gray.500"
                  >
                    {loadingCurrentLocation
                      ? 'Detecting...'
                      : currentAddress
                        ? truncateAddress(currentAddress, 40)
                        : 'Enable location access'}
                  </Text>
                </Box>
              </Flex>

              {/* Divider with text */}
              <Flex
                align="center"
                gap="12px"
              >
                <Box
                  flex="1"
                  h="1px"
                  bg="gray.200"
                />
                <Text
                  fontSize="12px"
                  color="gray.400"
                  fontWeight="500"
                >
                  OR SEARCH
                </Text>
                <Box
                  flex="1"
                  h="1px"
                  bg="gray.200"
                />
              </Flex>

              {/* Search Input with Autocomplete */}
              {isGoogleLoaded ? (
                <PlacesAutocomplete
                  value={searchAddress}
                  onChange={setSearchAddress}
                  onSelect={handleSelect}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <Box>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <FiSearch color="#A0AEC0" />
                        </InputLeftElement>
                        <Input
                          {...getInputProps({
                            placeholder: 'Search for area, street name...'
                          })}
                          borderRadius="12px"
                          border="2px solid"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: '#FF6B35',
                            boxShadow: '0 0 0 1px #FF6B35'
                          }}
                          _placeholder={{ color: 'gray.400', fontSize: '14px' }}
                          fontSize="14px"
                        />
                        {searchAddress && (
                          <InputRightElement>
                            <IconButton
                              aria-label="Clear"
                              icon={<FiX />}
                              size="sm"
                              variant="ghost"
                              onClick={() => setSearchAddress('')}
                            />
                          </InputRightElement>
                        )}
                      </InputGroup>

                      {/* Suggestions List */}
                      {(loading || suggestions.length > 0) && (
                        <Box
                          mt="8px"
                          bg="white"
                          borderRadius="12px"
                          border="1px solid"
                          borderColor="gray.200"
                          maxH="250px"
                          overflowY="auto"
                          boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                        >
                          {loading && (
                            <Box p="12px">
                              <Skeleton
                                height="20px"
                                mb="8px"
                              />
                              <Skeleton
                                height="20px"
                                mb="8px"
                              />
                              <Skeleton height="20px" />
                            </Box>
                          )}
                          {suggestions.map((suggestion: any) => (
                            <Flex
                              {...getSuggestionItemProps(suggestion)}
                              key={suggestion.placeId}
                              align="start"
                              p="12px 16px"
                              cursor="pointer"
                              bg={suggestion.active ? 'gray.50' : 'white'}
                              _hover={{ bg: 'gray.50' }}
                              borderBottom="1px solid"
                              borderColor="gray.100"
                              _last={{ borderBottom: 'none' }}
                              transition="all 0.15s"
                            >
                              <Box
                                color="gray.400"
                                mr="12px"
                                mt="2px"
                              >
                                <FiMapPin size="16px" />
                              </Box>
                              <Box flex="1">
                                <Text
                                  fontSize="14px"
                                  fontWeight="600"
                                  color="gray.800"
                                  mb="2px"
                                >
                                  {suggestion.formattedSuggestion?.mainText || suggestion.description}
                                </Text>
                                <Text
                                  fontSize="12px"
                                  color="gray.500"
                                  noOfLines={1}
                                >
                                  {suggestion.formattedSuggestion?.secondaryText || ''}
                                </Text>
                              </Box>
                            </Flex>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </PlacesAutocomplete>
              ) : (
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="#A0AEC0" />
                  </InputLeftElement>
                  <Input
                    placeholder="Loading location services..."
                    isDisabled
                    borderRadius="12px"
                    border="2px solid"
                    borderColor="gray.200"
                  />
                </InputGroup>
              )}

              {/* Saved Locations (Future Feature) */}
              <Box>
                <Text
                  fontSize="12px"
                  color="gray.400"
                  fontWeight="500"
                  mb="8px"
                >
                  RECENT LOCATIONS
                </Text>
                <Text
                  fontSize="13px"
                  color="gray.500"
                  textAlign="center"
                  py="12px"
                >
                  No recent locations
                </Text>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LocationSelector
