import React, { useState } from 'react'
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

const ViewInformation = () => {
  const item = {
    startDate: '',
    endDate: '',
    title: '',
    category: '',
    sourceOwner: '',
    description: '',
    country: '',
    status: 'Publish'
  }

  const [policyStatus, setPolicyStatus] = useState(item.status.toUpperCase())

  const router = useRouter()

  const getStatusDrodpwnItems = (statusDetails: string) => {
    if (statusDetails === PolicyStatusType.PUBLISH) {
      return policyStatusOptions.filter(status => status.value !== PolicyStatusType.ACTIVE)
    }
    if (statusDetails == PolicyStatusType.INACTIVE) {
      return policyStatusOptions.filter(status => status.value !== PolicyStatusType.PUBLISH)
    }
    return policyStatusOptions
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
              text="BLR Airport traffic"
            />
          </FormControl>

          <FormControl mb={{ base: '10px', md: 'unset' }}>
            <FormLabel>Information Category</FormLabel>
            <Typography
              fontSize="14px"
              text="Geofence"
            />
          </FormControl>

          <FormControl mb={{ base: '16px', md: 'unset' }}>
            <FormLabel>Information Source Owner</FormLabel>
            <Typography
              fontSize="14px"
              text="BLR traffic police"
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
            text="Add Description"
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
                text="country"
              />
            </FormControl>

            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>City</FormLabel>
              <Typography
                fontSize="14px"
                text="city"
              />
            </FormControl>
          </Flex>
          <Flex w="100%">
            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>From</FormLabel>
              <Typography
                fontSize="14px"
                text={item.startDate}
              />
            </FormControl>

            <FormControl mb={{ base: '10px', md: 'unset' }}>
              <FormLabel>To</FormLabel>
              <Typography
                fontSize="14px"
                text={item.endDate}
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
              href="https://www.google.com"
              fontSize={'14px'}
            >
              {'https://www.google.com'}
            </Link>
          </FormControl>

          <FormControl mb={{ base: '10px', md: 'unset' }}>
            <FormLabel>Applicable To</FormLabel>
            <Typography
              fontSize="14px"
              text=""
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
                  coords: JSON.stringify([
                    {
                      lat: 12.90218055284065,
                      lng: 77.56138163654384
                    },
                    {
                      lat: 12.905861728332741,
                      lng: 77.6109917744833
                    },
                    {
                      lat: 12.898415658229917,
                      lng: 77.61227923481044
                    }
                  ])
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
              {''}
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
          w={{ base: '100%', md: 'unset' }}
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Update"
          _hover={{ opacity: 0.9 }}
          onClick={() => {}}
          w={{ base: '100%', md: 'unset' }}
        />
      </Flex>
    </Box>
  )
}

export default ViewInformation
