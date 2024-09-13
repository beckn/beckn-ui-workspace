import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Divider,
  Code,
  Link
} from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import CustomButton from '@components/Button/CustomButton'
import { policyStatusOptions } from '@lib/constants'
import { PolicyStatusType } from '@lib/types/metaData'
import { useGetPolicyDetailsMutation } from '@services/PolicyService'
import { formatDate } from '@utils/general'

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

  const [policyStatus, setPolicyStatus] = useState(item.status.toUpperCase())
  const [getPolicyDetails] = useGetPolicyDetailsMutation()

  const router = useRouter()
  const { policyId } = router.query // Get the policyId from the URL query params

  // API call to get policy by ID
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
        const geofence = policy?.geofences[0]['polygon']
        const rules = policy?.rules
        const applicable = policy?.coverage[0]['subscribers']
          ?.map((item: { type: any }) => item.type.toUpperCase())
          .join(', ')
        const source = policy?.media?.url
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
        setPolicyStatus(policy.status.toUpperCase()) // Update policy status in state
      } catch (error) {
        console.error('Error fetching policy:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (policyId) {
      getPolicyById(policyId)
    }
  }, [policyId])

  const getStatusDrodpwnItems = (statusDetails: any) => {
    if (statusDetails === PolicyStatusType.PUBLISH) {
      return policyStatusOptions.filter(status => status.value !== PolicyStatusType.ACTIVE)
    }
    if (statusDetails == PolicyStatusType.INACTIVE) {
      return policyStatusOptions.filter(status => status.value !== PolicyStatusType.PUBLISH)
    }
    return policyStatusOptions
  }
  const getGeoFenceCoords = (coords: string[]) => {
    return coords.map(item => {
      const latLong = item.split(', ')
      return {
        lat: Number(latLong[0]),
        lng: Number(latLong[1])
      }
    })
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
            <Select
              placeholder="Select"
              width={'45.2%'}
              value={policyStatus}
              color={
                policyStatus === PolicyStatusType.ACTIVE
                  ? 'green'
                  : policyStatus === PolicyStatusType.INACTIVE
                    ? 'red'
                    : 'blue'
              }
              onChange={event => setPolicyStatus(event.target.value || policyStatus)}
            >
              {getStatusDrodpwnItems(policyStatus).map((statusType, index) => (
                <option
                  key={index}
                  value={statusType.value}
                >
                  {statusType.label}
                </option>
              ))}
            </Select>
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
                text={formatDate(item.startDate)}
              />
            </FormControl>

            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>To</FormLabel>
              <Typography
                fontSize="14px"
                text={formatDate(item.endDate)}
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
              {JSON.stringify(item.rules)}
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
          onClick={() => {}}
          w={{ base: '100%', md: '100%' }}
        />
      </Flex>
    </Box>
  )
}

export default ViewInformation
