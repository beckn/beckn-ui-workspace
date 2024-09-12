import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  HStack,
  Switch,
  Divider,
  Code,
  Image,
  FormErrorMessage,
  Link
} from '@chakra-ui/react'
import CustomDatePicker from '@components/customDatePicker'
import { Typography } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import addIcon from '@public/images/plus_icon.svg'
import { applicableToOptions, cities, countries, infoCategories } from '@lib/constants'
import CustomButton from '@components/Button/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearPolicyMetaData,
  PolicyRootState,
  updateApplicableTo,
  updateCity,
  updateCountry,
  updateDescription,
  updateEndDate,
  updatePolicyActivationStatus,
  updatepolicyDocuments,
  updatePolicyName,
  updatePolicyOwner,
  updatePolicyType,
  updateRules,
  updateStartDate
} from '@store/policy.slice'
import MultiSelectDropdown from '@components/CheckBoxSelect/checkBoxSelect'
import { PolicyType, RulesTemplate } from '@lib/types/metaData'
import { useCreatePolicyMutation } from '@services/PolicyService'
import { feedbackActions } from '@beckn-ui/common'

function AddInformationMetadata() {
  const [errors, setErrors] = useState({
    policyName: '',
    policyType: '',
    policyOwner: '',
    description: '',
    country: '',
    city: '',
    startDate: '',
    endDate: '',
    policyDocuments: '',
    applicableTo: ''
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const {
    policyName,
    policyType,
    policyOwner,
    description,
    country,
    city,
    startDate,
    endDate,
    policyDocuments,
    applicableTo,
    rules,
    polygon,
    isActivate
  } = useSelector((state: PolicyRootState) => state.policy)

  const [createPolicy] = useCreatePolicyMutation()

  const handleOnSwitch = () => {
    dispatch(updatePolicyActivationStatus(!isActivate))
  }

  // Validation logic
  const validateForm = () => {
    let valid = true
    const newErrors = {
      policyName: '',
      policyType: '',
      policyOwner: '',
      description: '',
      country: '',
      city: '',
      startDate: '',
      endDate: '',
      policyDocuments: '',
      applicableTo: ''
    }

    if (!policyName) {
      newErrors.policyName = 'Title is required'
      valid = false
    }

    if (!policyType) {
      newErrors.policyType = 'Information category is required'
      valid = false
    }

    if (!policyOwner) {
      newErrors.policyOwner = 'Owner name is required'
      valid = false
    }

    if (!description) {
      newErrors.description = 'Description is required'
      valid = false
    }

    if (!country) {
      newErrors.country = 'Country is required'
      valid = false
    }

    if (!city) {
      newErrors.city = 'City is required'
      valid = false
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required'
      valid = false
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required'
      valid = false
    }

    if (!policyDocuments) {
      newErrors.policyDocuments = 'Source url is required'
      valid = false
    }

    if (applicableTo.length === 0) {
      newErrors.applicableTo = 'Applicable To is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const getRulesJson = useCallback(() => {
    const rules: RulesTemplate = {
      policy: {
        type: policyType,
        owner: { descriptor: { name: policyOwner, contact: { email: 'support@moh.gov.in' } } },
        descriptor: { name: policyName, short_desc: description },
        coverage: [
          {
            spatial: [{ country, city }],
            temporal: [{ range: { start: startDate, end: endDate } }],
            subscribers: applicableTo.map(to => {
              return { type: to }
            })
          }
        ],
        geofences: [{ polygon }],
        domain: 'mobility',
        media: [{ mimetype: '', url: policyDocuments }],
        status: (isActivate ? 'ACTIVE' : 'INACTIVE').toLowerCase()
      }
    }
    return rules
  }, [
    policyName,
    policyType,
    policyOwner,
    description,
    country,
    city,
    startDate,
    endDate,
    policyDocuments,
    applicableTo,
    polygon,
    isActivate
  ])

  const handleSavePolicy = async () => {
    if (!validateForm()) {
      return
    }
    try {
      await createPolicy(getRulesJson()).unwrap()
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Success',
            display: true,
            type: 'success',
            description: 'Policy saved successfully!'
          }
        })
      )
      dispatch(clearPolicyMetaData())
      router.push('/')
    } catch (error) {
      console.error('An error occurred while create policy:', error)
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Error',
            display: true,
            type: 'error',
            description: 'Something went wrong, please try again'
          }
        })
      )
    }
  }

  return (
    <Box
      maxH={'calc(100vh - 110px)'}
      overflowY="auto"
      overflowX="hidden"
      display={'flex'}
      flexDir="column"
      gap="2rem"
      className="hideScroll"
    >
      <Box
        p={4}
        border="1px solid #72767e"
      >
        <Flex
          width={'auto'}
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography
            text="Add Information Metadata"
            fontWeight="600"
            fontSize={'18px !important'}
          />
          <Box
            display={{ base: 'block', md: 'flex' }}
            flexDir={'row'}
            textAlign="center"
            justifyContent="space-evenly"
            width={{ base: 'unset', md: '15%' }}
            ml={{ base: '20px', md: 'unset' }}
          >
            <Typography
              text="Activate"
              style={{
                alignSelf: 'center'
              }}
              fontSize={'14px !important'}
            />
            <Switch
              ml="8px"
              size={{ base: 'md', md: 'lg' }}
              isChecked={isActivate}
              colorScheme={'green'}
              onChange={handleOnSwitch}
            />
          </Box>
        </Flex>
        <Box height={'1rem'} />
        <Divider />
        <Box height={'1rem'} />

        <HStack
          display={{ base: 'block', md: 'flex' }}
          spacing={3}
          gap="4rem"
        >
          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyName}
          >
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Title"
              value={policyName}
              onChange={event => dispatch(updatePolicyName(event.target.value))}
            />
            {errors.policyName && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.policyName}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyType}
          >
            <FormLabel>Information Category</FormLabel>
            <Select
              placeholder="Select Information Category"
              value={policyType}
              onChange={event => dispatch(updatePolicyType(event.target.value || ''))}
            >
              {infoCategories.map((category, index) => (
                <option
                  key={index}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </Select>
            {errors.policyType && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.policyType}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyOwner}
          >
            <FormLabel>Information Source Owner</FormLabel>
            <Input
              type="text"
              placeholder="Enter Information Source Owner Name"
              value={policyOwner}
              onChange={event => dispatch(updatePolicyOwner(event.target.value))}
            />
            {errors.policyOwner && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.policyOwner}
              </FormErrorMessage>
            )}
          </FormControl>
        </HStack>

        <FormControl
          mb="1rem"
          isInvalid={!!errors.description}
        >
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Add Description"
            value={description}
            onChange={event => dispatch(updateDescription(event.target.value))}
          />
          {errors.description && (
            <FormErrorMessage
              position={'absolute'}
              mt="0px"
            >
              {errors.description}
            </FormErrorMessage>
          )}
        </FormControl>

        <HStack
          display={{ base: 'block', md: 'flex' }}
          spacing={4}
          gap="4rem"
        >
          <FormControl
            mb="1rem"
            isInvalid={!!errors.country}
          >
            <FormLabel>Country</FormLabel>
            <Select
              placeholder="Select Country"
              value={country}
              onChange={event => dispatch(updateCountry(event.target.value || ''))}
            >
              {countries.map((country, index) => (
                <option
                  key={index}
                  value={country.value}
                >
                  {country.label}
                </option>
              ))}
            </Select>
            {errors.country && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.country}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.city}
          >
            <FormLabel>City</FormLabel>
            <Select
              placeholder="Select City"
              value={city}
              onChange={event => dispatch(updateCity(event.target.value || ''))}
            >
              {cities.map((city, index) => (
                <option
                  key={index}
                  value={city.value}
                >
                  {city.label}
                </option>
              ))}
            </Select>
            {errors.city && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.city}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.startDate}
          >
            <FormLabel>From</FormLabel>
            <CustomDatePicker
              selected={startDate ? new Date(startDate) : null}
              placeholderText="Select 'from' date"
              onChange={(date: any) => dispatch(updateStartDate(date?.toISOString()))}
              dateFormat="dd-MM-yyyy"
              isInvalid={!!errors.startDate}
            />
            {errors.startDate && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.startDate}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.endDate}
          >
            <FormLabel>To</FormLabel>
            <CustomDatePicker
              selected={endDate ? new Date(endDate) : null}
              placeholderText="Select 'to' date"
              onChange={(date: any) => dispatch(updateEndDate(date?.toISOString()))}
              dateFormat="dd-MM-yyyy"
              isInvalid={!!errors.startDate}
            />
            {errors.endDate && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.endDate}
              </FormErrorMessage>
            )}
          </FormControl>
        </HStack>

        <HStack
          display={{ base: 'block', md: 'flex' }}
          spacing={4}
          gap="4rem"
        >
          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyDocuments}
          >
            <FormLabel>Sources</FormLabel>
            <Input
              type="text"
              placeholder="Add Source URL"
              value={policyDocuments}
              onChange={event => dispatch(updatepolicyDocuments(event.target.value))}
            />
            {errors.policyDocuments && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.policyDocuments}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.applicableTo}
          >
            <FormLabel>Applicable To</FormLabel>
            <MultiSelectDropdown
              options={applicableToOptions}
              selectedOptions={applicableTo}
              isInvalid={!!errors.applicableTo}
              setSelectedOptions={data => {
                dispatch(updateApplicableTo(data))
              }}
            />
            {errors.applicableTo && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
              >
                {errors.applicableTo}
              </FormErrorMessage>
            )}
          </FormControl>
        </HStack>
      </Box>

      {policyType === PolicyType.GEOFENCE && (
        <Box
          p={4}
          border="1px solid #72767e"
        >
          <FormControl>
            <FormLabel>Geofence</FormLabel>
            {polygon.length === 0 ? (
              <Box
                width="fit-content"
                border={'1px dotted #004e92 !important'}
                padding="1rem 2rem"
                borderRadius={'md'}
                cursor="pointer"
                onClick={() => {
                  router.push('/createGeofence')
                }}
              >
                <Flex
                  flexDirection={'row'}
                  alignItems="center"
                  mr="1rem"
                  cursor="pointer"
                >
                  <Image
                    src={addIcon}
                    alt="add_icon"
                    width={'1rem'}
                    height={'1rem'}
                  />
                  <Typography
                    text="Draw geofence on a map"
                    fontSize="14px"
                    color="#013b76"
                  />
                </Flex>
              </Box>
            ) : (
              <Link
                color="#5c5cff"
                onClick={() => router.push('/createGeofence')}
                fontSize={'14px'}
              >
                {'View Geofence'}
              </Link>
            )}
          </FormControl>
        </Box>
      )}

      <Box
        p={4}
        border="1px solid #72767e"
      >
        <FormControl>
          <FormLabel>Rules</FormLabel>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'inherit',
              borderRadius: 'md'
            }}
            minH={'40px'}
            maxH="20rem"
            overflow={'auto'}
            className="hideScroll"
          >
            <Code
              height={'100%'}
              background="transparent"
              contentEditable={true}
              whiteSpace="pre-wrap"
              width="100%"
              overflowY="auto"
              overflowX="hidden"
              lineHeight={'normal'}
            >
              {applicableTo.length > 0 && JSON.stringify(getRulesJson(), undefined, 4)}
            </Code>
          </Box>
        </FormControl>
      </Box>

      <Flex
        width={{ base: '100%', md: '31rem' }}
        display={{ base: 'block', md: 'flex' }}
      >
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => {
            dispatch(clearPolicyMetaData())
            router.push('/')
          }}
          mr="1rem"
          w={{ base: '100%', md: '100%' }}
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Save"
          _hover={{ opacity: 0.9 }}
          onClick={handleSavePolicy}
          w={{ base: '100%', md: '100%' }}
        />
      </Flex>
    </Box>
  )
}

export default AddInformationMetadata
