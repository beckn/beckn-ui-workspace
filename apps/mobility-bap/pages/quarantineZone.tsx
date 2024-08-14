import { Box, Flex, Grid, GridItem, Link, Text } from '@chakra-ui/react'
import axios from '@services/axios'
import { policyActions } from '@store/policy-slice'
import { formatDate } from '@utils/general'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

interface PolicyDetailsModel {
  description: string
  type: string
  name: string
  domain: string
  country: string
  city: string
  startDate: string
  endDate: string
  applicableTo: Array<string>
  owner: string
  polygon: Array<string>
  status: string
  policyDocuments: string
}

const QuarantineZone = () => {
  const [policyDetails, setPolicyDetails] = useState<PolicyDetailsModel>({
    description: 'BLR Airport traffic hence diversion.',
    type: 'Geofence',
    name: 'BLR Airport traffic',
    domain: 'mobility',
    country: 'India',
    city: 'Banglore',
    startDate: '2020-01-01T00:00:00.000+00:00',
    endDate: '2025-12-31T00:00:00.000+00:00',
    applicableTo: ['BAP', 'BPP'],
    owner: 'BLR traffic police',
    polygon: [
      '13.224368101102783,77.69723945770129',
      '13.200303188252956,77.75457435760363',
      '13.163699923041616,77.73019844207629',
      '13.139796208051319,77.62376838836535',
      '13.217683641151229,77.62222343597277',
      '13.227877369222877,77.64831596526965'
    ],
    status: 'applied',
    policyDocuments: 'https://google.com'
  })

  const router = useRouter()
  const dispatch = useDispatch()

  const getPolicyDetails = () => {
    try {
      axios
        .post(`https://api.mobility-bap-policy-demo.becknprotocol.io/v1/policy/${router.query.policyId}`)
        .then(res => {
          setPolicyDetails(res.data)
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getPolicyDetails()
  }, [])

  const handleGeofenceClick = () => {
    dispatch(policyActions.setPolygonGeolocation(policyDetails.polygon))
    router.push('/geofence')
  }

  return (
    <Box
      mt="90px"
      p={[2, 4, 6]}
    >
      <Grid
        templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}
        gap={4}
      >
        <GridItem>
          <Text fontWeight="bold">Name</Text>
          <Text>{policyDetails.name}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Owner</Text>
          <Text>{policyDetails.owner}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">Type</Text>
          <Text>{policyDetails.type}</Text>
        </GridItem>
      </Grid>
      <Box mt={4}>
        <Text fontWeight="bold">Description</Text>
        <Text>{policyDetails.description}</Text>
      </Box>
      <Grid
        templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}
        gap={4}
        mt={4}
      >
        <GridItem>
          <Text fontWeight="bold">Country</Text>
          <Text>{policyDetails.country}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">City</Text>
          <Text>{policyDetails.city}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">From</Text>
          <Text>{formatDate(policyDetails.startDate)}</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="bold">To</Text>
          <Text>{formatDate(policyDetails.endDate)}</Text>
        </GridItem>
      </Grid>
      <Box
        mt={4}
        lineHeight={'18px'}
      >
        <Text fontWeight="bold">Policy Document</Text>
        <Link
          href={policyDetails.policyDocuments}
          color="blue.500"
          isExternal
          fontSize={'12px'}
        >
          {policyDetails.policyDocuments}
        </Link>
      </Box>
      <Box mt={4}>
        <Text fontWeight="bold">Applicable To</Text>
        <Text>{policyDetails.applicableTo.join(', ')}</Text>
      </Box>
      <Box
        mt={4}
        lineHeight={'18px'}
      >
        <Text fontWeight="bold">Geofence</Text>
        <Link
          color="blue.500"
          onClick={handleGeofenceClick}
          cursor="pointer"
          fontSize={'12px'}
        >
          Click to view
        </Link>
      </Box>
    </Box>
  )
}

export default QuarantineZone
