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
  Image
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
    >
      <Box
        p={4}
        border="1px solid #72767e"
      >
        <Flex
          width={'auto'}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            text="Add Information Metadata"
            fontWeight="600"
            fontSize={'18px !important'}
          />
          <Box
            display={'flex'}
            flexDir={'row'}
            justifyContent="space-between"
            width={'9%'}
          >
            <Typography
              text="Activate"
              style={{
                alignSelf: 'center'
              }}
              fontSize={'14px !important'}
            />
            <Switch
              size={'lg'}
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
          spacing={3}
          gap="4rem"
        >
          <FormControl mb="1rem">
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Title"
              value={policyName}
              onChange={event => dispatch(updatePolicyName(event.target.value))}
            />
          </FormControl>

          <FormControl mb="1rem">
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
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>Information Source Owner</FormLabel>
            <Input
              type="text"
              placeholder="Enter Information Source Owner Name"
              value={policyOwner}
              onChange={event => dispatch(updatePolicyOwner(event.target.value))}
            />
          </FormControl>
        </HStack>

        <FormControl mb="1rem">
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Add Description"
            value={description}
            onChange={event => dispatch(updateDescription(event.target.value))}
          />
        </FormControl>

        <HStack
          spacing={4}
          gap="4rem"
        >
          <FormControl mb="1rem">
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
          </FormControl>

          <FormControl mb="1rem">
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
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>From</FormLabel>
            <CustomDatePicker
              selected={new Date(startDate)}
              placeholderText="Select 'from' date"
              onChange={date => dispatch(updateStartDate(date?.toISOString()))}
              dateFormat="dd-MM-yyyy"
            />
          </FormControl>

          <FormControl mb="1rem">
            <FormLabel>To</FormLabel>
            <CustomDatePicker
              selected={new Date(endDate)}
              placeholderText="Select 'to' date"
              onChange={date => dispatch(updateEndDate(date?.toISOString()))}
              dateFormat="dd-MM-yyyy"
            />
          </FormControl>
        </HStack>

        <HStack
          spacing={4}
          gap="4rem"
        >
          <FormControl>
            <FormLabel>Sources</FormLabel>
            <Input
              type="text"
              placeholder="Add Source URL"
              value={policyDocuments}
              onChange={event => dispatch(updatepolicyDocuments(event.target.value))}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Applicable To</FormLabel>
            <MultiSelectDropdown
              options={applicableToOptions}
              selectedOptions={applicableTo}
              setSelectedOptions={data => {
                dispatch(updateApplicableTo(data))
              }}
            />
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
              height: { base: '40px', md: '20rem' },
              border: '1px solid',
              borderColor: 'inherit',
              borderRadius: 'md'
            }}
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

      <Flex width={'31rem'}>
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => {
            dispatch(clearPolicyMetaData())
            router.push('/')
          }}
          mr="1rem"
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Save"
          _hover={{ opacity: 0.9 }}
          onClick={handleSavePolicy}
        />
      </Flex>
    </Box>
  )
}

export default AddInformationMetadata
