import React, { useEffect, useState } from 'react'
import { Box, Flex, FormControl, FormLabel, HStack, Divider, Code, Link } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import CustomButton from '@components/Button/CustomButton'
import { policyStatusOptions } from '@lib/constants'
import { PolicyStatusType, PolicyType } from '@lib/types/metaData'
import { useGetPolicyDetailsMutation, useUpdatePolicyMutation } from '@services/PolicyService'
import { formatDate } from '@utils/general'
import { feedbackActions } from '@beckn-ui/common'
import { useDispatch } from 'react-redux'
import { getGeoFenceCoords } from '@utils/geoLocation'
import { GenericDropdown } from '@components/statusDropdown/GenericDropdown'

const ViewInformation = () => {
  const [item, setItem] = useState({
    startDate: '',
    endDate: '',
    title: '',
    category: '',
    sourceOwner: '',
    description: '',
    country: '',
    status: '',
    geofence: [],
    rules: null,
    applicable: '',
    city: '',
    source: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [policyStatus, setPolicyStatus] = useState(item.status)
  const [getPolicyDetails] = useGetPolicyDetailsMutation()
  const [updatePolicy] = useUpdatePolicyMutation()

  const router = useRouter()
  const dispatch = useDispatch()
  const { policyId } = router.query

  useEffect(() => {
    const getPolicyById = async (id: any) => {
      try {
        setIsLoading(true)
        const response = await getPolicyDetails({ policyId: id }).unwrap()
        const policy = response.policy

        const country = policy.coverage[0]['spatial'][0].country
        const city = policy.coverage[0]['spatial'][0].city
        const startDate = policy.coverage[0]['temporal'][0]['range']['start']
        const endDate = policy.coverage[0]['temporal'][0]['range']['end']
        const title = policy?.name
        const category = policy?.type
        const sourceOwner = policy?.owner
        const description = policy?.descriptor
        const status = policy?.status
        const geofence = policy?.geofences?.[0]['polygon'] || []
        const rules = policy?.rules
        const applicable = policy?.coverage[0]['subscribers']?.map((item: { type: any }) => item.type).join(', ')
        const source = policy?.media?.url || policy?.rules?.message?.policy?.descriptor?.media?.[0]?.url
        setItem({
          startDate,
          endDate,
          title,
          category,
          sourceOwner,
          description,
          country,
          status,
          geofence,
          rules,
          applicable,
          city,
          source
        })
        setPolicyStatus(policy.status)
      } catch (error) {
        console.error('Error fetching policy:', error)
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
      } finally {
        setIsLoading(false)
      }
    }

    if (policyId) {
      getPolicyById(policyId)
    }
  }, [policyId])

  const getStatusDrodpwnItems = (statusDetails: any) => {
    if (statusDetails === PolicyStatusType.PUBLISHED) {
      return policyStatusOptions.filter(status => status.value !== PolicyStatusType.ACTIVE)
    }
    if (statusDetails == PolicyStatusType.INACTIVE) {
      return policyStatusOptions.filter(status => status.value !== PolicyStatusType.PUBLISHED)
    }
    return policyStatusOptions
  }

  const handleOnUpdate = async () => {
    try {
      const payload = {
        policyId: policyId,
        status: policyStatus
      }

      await updatePolicy(payload).unwrap()
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Success',
            display: true,
            type: 'success',
            description: 'Policy updated successfully!'
          }
        })
      )
      router.push('/')
    } catch (error) {
      console.error('Error updating policy:', error)
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
        <Typography
          text="Information Update Metadata"
          fontWeight="600"
          fontSize={'18px !important'}
        />
        <Box height={'1rem'} />
        <Divider />
        <Box height={'1rem'} />

        <HStack
          display={{ base: 'block', md: 'flex' }}
          spacing={3}
          mb="1rem"
        >
          <FormControl mb={{ base: '10px', md: 'unset' }}>
            <FormLabel>Title</FormLabel>
            <Typography
              fontSize="14px"
              text={item.title}
            />
          </FormControl>

          <FormControl mb={{ base: '10px', md: 'unset' }}>
            <FormLabel>Information Category</FormLabel>
            <Typography
              fontSize="14px"
              text={item.category}
            />
          </FormControl>

          <FormControl mb={{ base: '16px', md: 'unset' }}>
            <FormLabel>Information Source Owner</FormLabel>
            <Typography
              fontSize="14px"
              text={item.sourceOwner}
            />
          </FormControl>

          <FormControl
            mb={{ base: '10px', md: 'unset' }}
            display={{ base: 'flex', md: 'block' }}
            alignItems={{ base: 'center', md: 'unset' }}
          >
            <FormLabel>Status</FormLabel>
            <GenericDropdown
              options={getStatusDrodpwnItems(policyStatus)}
              selectedValue={policyStatus}
              setSelectedValue={value => {
                setPolicyStatus(value || policyStatus)
              }}
              withColors={true}
              buttonStyles={{
                width: '8rem',
                color:
                  policyStatus === PolicyStatusType.ACTIVE
                    ? 'green'
                    : policyStatus === PolicyStatusType.INACTIVE
                      ? 'red'
                      : 'blue'
              }}
            />
          </FormControl>
        </HStack>

        <FormControl mb="1rem">
          <FormLabel>Description</FormLabel>
          <Typography
            fontSize="14px"
            text={item.description}
          />
        </FormControl>

        <HStack
          display={{ base: 'block', md: 'flex' }}
          spacing={4}
          mb="1rem"
        >
          <Flex
            w="100%"
            mb={{ base: '16px', md: 'unset' }}
          >
            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>Country</FormLabel>
              <Typography
                fontSize="14px"
                text={item.country}
              />
            </FormControl>

            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>City</FormLabel>
              <Typography
                fontSize="14px"
                text={item.city}
              />
            </FormControl>
          </Flex>
          <Flex w="100%">
            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>From</FormLabel>
              <Typography
                fontSize="14px"
                text={item.startDate ? formatDate(item.startDate) : ''}
              />
            </FormControl>

            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>To</FormLabel>
              <Typography
                fontSize="14px"
                text={item.endDate ? formatDate(item.endDate) : ''}
              />
            </FormControl>
          </Flex>
        </HStack>

        <HStack
          spacing={4}
          display={{ base: 'block', md: 'flex' }}
        >
          <FormControl mb={{ base: '10px', md: 'unset' }}>
            <FormLabel>Sources</FormLabel>
            <Link
              color="#5c5cff"
              target={'_blank'}
              href={item.source}
              fontSize={'14px'}
            >
              {item.source}
            </Link>
          </FormControl>

          <FormControl mb={{ base: '10px', md: 'unset' }}>
            <FormLabel>Applicable To</FormLabel>
            <Typography
              fontSize="14px"
              text={item.applicable}
            />
          </FormControl>
        </HStack>
      </Box>

      {item.category === PolicyType.GEOFENCE && (
        <Box
          p={4}
          border="1px solid #72767e"
        >
          <FormControl>
            <FormLabel>Geofence</FormLabel>
            <Link
              color="#5c5cff"
              onClick={() =>
                router.push({
                  pathname: '/viewGeofence',
                  query: {
                    city: item.city,
                    coords: JSON.stringify(getGeoFenceCoords(item.geofence))
                  }
                })
              }
              fontSize={'14px'}
            >
              {'Click to view'}
            </Link>
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
              contentEditable={false}
              borderColor="transparent"
              whiteSpace="pre-wrap"
              width="100%"
              overflowY="auto"
              overflowX="hidden"
              lineHeight={'normal'}
              outline="none"
            >
              {item.rules ? JSON.stringify(item.rules, undefined, 4) : ''}
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
          onClick={() => router.push('/')}
          mr="1rem"
          w={{ base: '100%', md: '100%' }}
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Update"
          _hover={{ opacity: 0.9 }}
          onClick={handleOnUpdate}
          w={{ base: '100%', md: '100%' }}
        />
      </Flex>
    </Box>
  )
}

export default ViewInformation
