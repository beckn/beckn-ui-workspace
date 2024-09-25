import { BottomModal, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
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
    description: '',
    type: '',
    name: '',
    domain: '',
    country: '',
    city: '',
    startDate: '',
    endDate: '',
    applicableTo: [],
    owner: '',
    polygon: [],
    status: '',
    policyDocuments: ''
  })
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [isApplied, setIsApplied] = useState<boolean>(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const getPolicyDetails = () => {
    try {
      axios
        .get(`https://api.mobility-bap-policy-demo.becknprotocol.io/v1/policy/${router.query.policyId}`)
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

  const handleOnApply = (policy: PolicyDetailsModel) => {
    if (policy.status === 'new') {
      try {
        axios
          .put(`https://api.mobility-bap-policy-demo.becknprotocol.io/v1/policy`, {
            policy: {
              id: router.query.policyId,
              status: 'applied'
            }
          })
          .then(res => {
            console.log('policy applied--> ', res)
            if (res.data.status === 'applied') {
              setIsApplied(true)
              setOpenAlert(true)
            }
          })
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <Box
      mt="90px"
      p={[2, 4, 6]}
      maxH={'calc(100vh - 120px)'}
      overflowY="scroll"
    >
      <Flex
        flexDirection={'column'}
        justifyContent={'space-between'}
        height={'calc(100vh - 100px)'}
      >
        <Box>
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
        <Box w="100%">
          <BecknButton
            text="Apply"
            disabled={policyDetails.status === 'applied'}
            handleClick={() => handleOnApply(policyDetails)}
            variant="solid"
          />
          <BecknButton
            text="Dispute"
            handleClick={() => setOpenAlert(true)}
            variant="outline"
          />
        </Box>
      </Flex>
      <BottomModal
        isOpen={openAlert}
        title={isApplied ? 'Policy Applied' : 'Dispute Policy'}
        onClose={() => setOpenAlert(false)}
        children={
          <Box>
            <Typography
              text={
                isApplied
                  ? 'Quarantine Zone Policy has been applied successfully!'
                  : 'To raise a dispute against this policy, please send an email to policy@openmobilitynetwork.com'
              }
              fontSize="14px"
              style={{ padding: '1rem 2rem', textAlign: 'center' }}
            />
            <BecknButton
              text="Go back to Home"
              handleClick={() => router.push('/')}
              variant="solid"
            />
          </Box>
        }
      />
    </Box>
  )
}

export default QuarantineZone
