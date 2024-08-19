import { Badge, Box, Flex, Icon, Text, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaFileAlt } from 'react-icons/fa'
import axios from '@services/axios'

interface PolicySummaryModel {
  id: string
  type: string
  name: string
  startDate: string
  endDate: string
  status: string
}

const Policies = () => {
  const [policyList, setPolicyList] = useState<PolicySummaryModel[]>([])

  const theme = useTheme()
  const router = useRouter()

  const getPolicies = () => {
    try {
      axios.get(`https://api.mobility-bap-policy-demo.becknprotocol.io/v1/policy`).then(res => {
        setPolicyList(res.data)
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getPolicies()
  }, [])

  const handleOpenViolatedPolicy = (policyId: string) => {
    router.push({
      pathname: '/quarantineZone',
      query: {
        policyId
      }
    })
  }

  return (
    <Box
      mt="90px"
      p={[5, 4, 8]}
    >
      {policyList.map(summary => {
        return (
          <Flex
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            maxW="sm"
            bg="white"
            p={[2, 4, 6]}
            mb={'1rem'}
            onClick={() => handleOpenViolatedPolicy(summary.id)}
          >
            <Flex
              alignItems="center"
              mb={4}
            >
              <Icon
                as={FaFileAlt}
                boxSize={8}
                mr={4}
              />
            </Flex>
            <Box>
              <Text fontWeight="bold">{summary.name}</Text>
              <Flex
                justifyContent="space-between"
                mb={2}
              >
                <Text fontSize={'10px'}>{`Start Date: ${summary.startDate}`}</Text>
                <Text fontSize={'10px'}>{`End Date: ${summary.endDate}`}</Text>
              </Flex>
              <Text fontSize={'10px'}>{`Type: ${summary.type}`}</Text>
            </Box>
            {summary.status.toLowerCase() !== 'inactive' && (
              <Badge
                ml="auto"
                colorScheme={summary.status.toLowerCase() === 'active' ? 'green' : theme.colors.primary['100']}
                height={'fit-content'}
                textTransform={'capitalize'}
              >
                {summary.status}
              </Badge>
            )}
          </Flex>
        )
      })}
    </Box>
  )
}

export default Policies
