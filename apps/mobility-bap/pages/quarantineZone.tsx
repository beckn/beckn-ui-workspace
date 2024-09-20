import { BottomModal, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Grid, GridItem, Link, Text } from '@chakra-ui/react'
import { policyStatusMap } from '@lib/constant'
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
      axios.get(`${process.env.NEXT_PUBLIC_POLICY_VIOLATION}/bap/policies/${router.query.policyId}`).then(res => {
        if (res.data && res.data.data.length > 0) {
          const attributes = res.data.data[0].attributes
          const policyData = {
            description: attributes.short_description,
            type: attributes.type,
            name: attributes.name,
            domain: attributes.domain,
            country: attributes.coverage[0].spatial[0].country,
            city: attributes.coverage[0].spatial[0].city,
            startDate: attributes.coverage[0].temporal[0].range.start,
            endDate: attributes.coverage[0].temporal[0].range.end,
            applicableTo: attributes?.coverage[0]['subscribers']?.map((item: { type: any }) => item.type).join(', '),
            owner: attributes?.rules?.message?.policy?.owner?.descriptor.name,
            polygon: attributes?.geofences?.[0]['polygon'] || [],
            status: policyStatusMap[attributes?.pp_actions?.data?.[0]?.attributes?.action || attributes.status],
            policyDocuments: attributes?.mediaUrl || attributes?.rules?.message?.policy?.descriptor?.media?.[0]?.url
          }
          setPolicyDetails(policyData)
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getPolicyDetails()
  }, [router.query])

  const handleGeofenceClick = () => {
    dispatch(policyActions.setPolygonGeolocation(policyDetails.polygon))
    router.push('/geofence')
  }

  const handleOnApply = (policy: PolicyDetailsModel) => {
    if (policy.status === 'new') {
      try {
        axios
          .put(`${process.env.NEXT_PUBLIC_POLICY_VIOLATION}/bap/policy/${router.query.policyId}`, {
            action: 'accept',
            bap_id: 'mit-ps-bap.becknprotocol.io',
            bap_uri: 'https://mit-ps-bap.becknprotocol.io'
          })
          .then(res => {
            if (res.data.data?.[0]?.attributes.pp_actions.data?.attributes?.action === 'accept') {
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
            <Text>{policyDetails.applicableTo}</Text>
          </Box>
          {policyDetails.type.toLowerCase() === 'geofence' && (
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
          )}
        </Box>
        <Box w="100%">
          <BecknButton
            text="Apply"
            disabled={isApplied || policyDetails.status === 'applied'}
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
