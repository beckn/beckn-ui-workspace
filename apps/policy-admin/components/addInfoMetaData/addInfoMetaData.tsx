import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
import { applicableToOptions, citiesByCountry, countries, infoCategories } from '@lib/constants'
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
import { PolicyStatusType, PolicyType, RulesTemplate } from '@lib/types/metaData'
import { useCreatePolicyMutation } from '@services/PolicyService'
import { feedbackActions } from '@beckn-ui/common'
import { validateDateRange } from '@utils/general'
import { GenericDropdown } from '@components/GenericDropdown/GenericDropdown'
import { testIds } from '@shared/dataTestIds'

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
    applicableTo: '',
    geofence: ''
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

  const fetchCities = (country: string) => {
    return (citiesByCountry as any)[country]
  }

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
      applicableTo: '',
      geofence: ''
    }

    if (!policyName) {
      newErrors.policyName = 'Title is required'
      valid = false
    }

    if (policyName) {
      const value = policyName.replace(/\s/g, '')
      const policyNameValid = value.match(/^(.|\n){10,100}$/)
      if (!policyNameValid) {
        newErrors.policyName = 'The title must be between 10 and 100 characters long.'
        valid = false
      }
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

    if (description) {
      const value = description.replace(/\s/g, '')
      const descriptionValid = value.match(/^(.|\n){20,500}$/)
      if (!descriptionValid) {
        newErrors.description = 'The description must be between 20 and 500 characters long.'
        valid = false
      }
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

    if (startDate && endDate) {
      const isValid = validateDateRange(startDate, endDate)
      if (!isValid) {
        newErrors.startDate = 'Start date should be before end date'
        newErrors.endDate = 'End date should be after start date'
        valid = false
      }
    }

    if (!policyDocuments) {
      newErrors.policyDocuments = 'Source url is required'
      valid = false
    }

    if (policyDocuments) {
      const isValid = policyDocuments.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/)
      if (!isValid) {
        newErrors.policyDocuments = `Please enter a valid URL, starting with 'http://' or 'https://'.`
        valid = false
      }
    }

    if (applicableTo.length === 0) {
      newErrors.applicableTo = 'Applicable To is required'
      valid = false
    }

    if (policyType === PolicyType.GEOFENCE && polygon.length === 0) {
      newErrors.geofence = 'Geofence is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const getRulesJson = useCallback(() => {
    let rules: RulesTemplate = {
      context: {
        action: 'policy',
        domain: 'mobility',
        location: { country, city },
        version: '1.0.0'
      },
      message: {
        policy: {
          id: '',
          type: policyType,
          owner: { descriptor: { name: policyOwner, contact: { email: 'support@moh.gov.in' } } },
          descriptor: { name: policyName, short_desc: description, media: [{ mimetype: '', url: policyDocuments }] },
          coverage: [
            {
              spatial: [{ country, city }],
              temporal: [{ range: { start: startDate, end: endDate } }],
              subscribers: applicableTo.map(to => {
                return { type: to }
              })
            }
          ],
          domain: 'mobility',
          status: isActivate ? 'ACTIVE' : 'INACTIVE'
        }
      }
    }
    if (policyType === PolicyType.GEOFENCE) {
      rules.message.policy.geofences = [{ polygon }]
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
      const payload: any = {
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
          domain: 'mobility',
          media: [{ mimetype: '', url: policyDocuments }],
          status: isActivate ? PolicyStatusType.ACTIVE : PolicyStatusType.INACTIVE,
          rules: getRulesJson()
        }
      }
      if (policyType === PolicyType.GEOFENCE) {
        payload.policy.geofences = [{ polygon }]
      }

      await createPolicy(payload).unwrap()
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
      data-test="addInfoMeataData-container"
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
            dataTest={testIds.add_info_metadata}
          />
          <Box
            className="switch-btn"
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
              dataTest={testIds.switch_btn_text}
            />
            <Switch
              ml="8px"
              size={{ base: 'md', md: 'lg' }}
              isChecked={isActivate}
              colorScheme={'green'}
              onChange={handleOnSwitch}
              data-test={testIds.switch_btn}
            />
          </Box>
        </Flex>
        <Box height={'1rem'} />
        <Divider />
        <Box height={'1rem'} />

        <HStack
          className="detail-section"
          display={{ base: 'block', md: 'flex' }}
          spacing={3}
          gap="4rem"
        >
          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyName}
          >
            <FormLabel data-test={testIds.policy_title}>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Title"
              value={policyName}
              onChange={event => dispatch(updatePolicyName(event.target.value))}
              data-test={testIds.policy_title_input}
            />
            {errors.policyName && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.title_error}
              >
                {errors.policyName}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyType}
          >
            <FormLabel data-test={testIds.policy_info_category}>Information Category</FormLabel>
            <GenericDropdown
              dataTest={testIds.policy_info_category_dropdown}
              options={infoCategories}
              placeholder="Select Information Category"
              selectedValue={policyType}
              setSelectedValue={value => {
                dispatch(updatePolicyType(value || ''))
              }}
            />
            {errors.policyType && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.policy_info_category_error}
              >
                {errors.policyType}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.policyOwner}
          >
            <FormLabel data-test={testIds.info_source_owner}>Information Source Owner</FormLabel>
            <Input
              type="text"
              placeholder="Enter Information Source Owner Name"
              value={policyOwner}
              onChange={event => dispatch(updatePolicyOwner(event.target.value))}
              data-test={testIds.info_source_owner_input}
            />
            {errors.policyOwner && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.info_source_owner_input_error}
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
          <FormLabel data-test={testIds.policy_description}>Description</FormLabel>
          <Textarea
            placeholder="Add Description"
            value={description}
            onChange={event => dispatch(updateDescription(event.target.value))}
            data-test={testIds.policy_description_textArea}
          />
          {errors.description && (
            <FormErrorMessage
              position={'absolute'}
              mt="0px"
              data-test={testIds.policy_description_textArea_error}
            >
              {errors.description}
            </FormErrorMessage>
          )}
        </FormControl>

        <HStack
          className="country-row"
          display={{ base: 'block', md: 'flex' }}
          spacing={4}
          gap="4rem"
        >
          <FormControl
            mb="1rem"
            isInvalid={!!errors.country}
          >
            <FormLabel data-test={testIds.country}>Country</FormLabel>
            <GenericDropdown
              dataTest={testIds.country_dropdown}
              options={countries}
              placeholder="Select Country"
              selectedValue={country}
              setSelectedValue={value => {
                dispatch(updateCountry(value || ''))
                dispatch(updateCity(''))
              }}
            />
            {errors.country && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.country_error}
              >
                {errors.country}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.city}
          >
            <FormLabel data-test={testIds.city}>City</FormLabel>
            <GenericDropdown
              dataTest={testIds.city_dropdown}
              options={fetchCities(country)}
              placeholder="Select City"
              selectedValue={city}
              setSelectedValue={value => {
                dispatch(updateCity(value || ''))
              }}
            />
            {errors.city && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.city_error}
              >
                {errors.city}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.startDate}
            data-test={testIds.date_pick_from}
          >
            <FormLabel data-test={testIds.policy_from_date}>From</FormLabel>
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
                data-test={testIds.policy_from_date_error}
              >
                {errors.startDate}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="1rem"
            isInvalid={!!errors.endDate}
            data-test={testIds.date_pick_to}
          >
            <FormLabel data-test={testIds.policy_to_date}>To</FormLabel>
            <CustomDatePicker
              selected={endDate ? new Date(endDate) : null}
              placeholderText="Select 'to' date"
              onChange={(date: any) => dispatch(updateEndDate(date?.toISOString()))}
              dateFormat="dd-MM-yyyy"
              isInvalid={!!errors.endDate}
            />
            {errors.endDate && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.policy_to_date_error}
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
            mb="0.5rem"
            isInvalid={!!errors.policyDocuments}
          >
            <FormLabel data-test={testIds.policy_source}>Sources</FormLabel>
            <Input
              data-test={testIds.policy_source_input}
              type="text"
              placeholder="Add Source URL"
              value={policyDocuments}
              onChange={event => dispatch(updatepolicyDocuments(event.target.value))}
            />
            {errors.policyDocuments && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.policy_source_error}
              >
                {errors.policyDocuments}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb="0.5rem"
            isInvalid={!!errors.applicableTo}
          >
            <FormLabel data-test={testIds.policy_applicable_to}>Applicable To</FormLabel>
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
                data-test={testIds.policy_applicable_to_error}
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
          <FormControl
            mb="0.5rem"
            isInvalid={!!errors.geofence}
          >
            <FormLabel data-test={testIds.geofence}>Geofence</FormLabel>
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
                data-test={testIds.create_geofence}
              >
                <Flex
                  flexDirection={'row'}
                  alignItems="center"
                  mr="1rem"
                  cursor="pointer"
                >
                  <Image
                    data-test={testIds.geofence_icon}
                    src={addIcon}
                    alt="add_icon"
                    width={'1rem'}
                    height={'1rem'}
                  />
                  <Typography
                    dataTest={testIds.geofence_text}
                    text="Draw geofence on a map"
                    fontSize="14px"
                    color="#013b76"
                  />
                </Flex>
              </Box>
            ) : (
              <Link
                data-test={testIds.view_geofence}
                color="#5c5cff"
                onClick={() => router.push('/createGeofence')}
                fontSize={'14px'}
              >
                {'View Geofence'}
              </Link>
            )}
            {errors.geofence && (
              <FormErrorMessage
                position={'absolute'}
                mt="0px"
                data-test={testIds.geofence_error}
              >
                {errors.geofence}
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>
      )}

      <Box
        p={4}
        border="1px solid #72767e"
      >
        <FormControl mb="0.5rem">
          <FormLabel data-test={testIds.policy_rules}>Rules</FormLabel>
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
              data-test={testIds.policy_rules_code}
              height={'100%'}
              background="transparent"
              contentEditable={true}
              whiteSpace="pre-wrap"
              width="100%"
              overflowY="auto"
              overflowX="hidden"
              lineHeight={'normal'}
              outline="none"
            >
              {applicableTo.length > 0 && JSON.stringify(getRulesJson(), undefined, 4)}
            </Code>
          </Box>
        </FormControl>
      </Box>

      <Flex
        className="custom-btn"
        width={{ base: '100%', md: '31rem' }}
        display={{ base: 'block', md: 'flex' }}
      >
        <CustomButton
          data-test={testIds.go_back_home}
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
          data-test={testIds.save_policy}
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

