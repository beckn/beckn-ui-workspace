import { Badge, Box, Divider, Flex, Icon, Select, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaFileAlt } from 'react-icons/fa'
import axios from '@services/axios'
import { formatDate, groupDataBy } from '@utils/general'
import { Typography } from '@beckn-ui/molecules'
import { policyStatusMap } from '@lib/constant'

interface PolicySummaryModel {
  id: string
  type: string
  name: string
  startDate: string
  endDate: string
  status: string
  pp_actions: {
    data: {
      id: string
      attributes: {
        action: string
      }
    }[]
  }
}

type FilterType = '' | 'new' | 'applied' | 'disputed' | 'inactive'

const Policies = () => {
  const [policyList, setPolicyList] = useState<Record<string, PolicySummaryModel[]> | null>(null)
  const [filterByValue, setFilterByValue] = useState<FilterType>('')

  const router = useRouter()

  const getPolicies = () => {
    try {
      axios.get(`${process.env.NEXT_PUBLIC_POLICY_VIOLATION}/bap/policies`).then(res => {
        const computedData = groupDataBy(res.data.data, 'status')
        setPolicyList(computedData)
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

  const handleOnChange = (e: any) => {
    const value = e.target.value
    setFilterByValue(value)
  }

  const getFilteredData = (filterBy: string) => {
    if (policyList) {
      if (filterByValue === '') {
        return Object.values(policyList).flat()
      } else {
        return policyList?.[filterBy]
      }
    }
  }

  return (
    <Box mt="90px">
      <Flex
        p={[5, 4, 0, 4]}
        alignItems="center"
        width={{ base: '56%', md: '36%' }}
      >
        <Typography
          text="Filter:"
          fontSize="14px"
        />
        <Select
          onChange={handleOnChange}
          value={filterByValue}
          fontSize="15px"
          height={'30px'}
          border={'unset'}
          borderRadius="unset"
          borderBottom={'1px solid'}
          paddingBottom={'2px'}
          boxShadow={'none'}
          _focusVisible={{ zIndex: 1, borderColor: '#3182ce' }}
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="applied">Applied</option>
          <option value="disputed">Disputed</option>
        </Select>
      </Flex>
      <Divider />
      <Box p={[5, 4, 8]}>
        {getFilteredData(filterByValue)?.map(summary => {
          return (
            <Flex
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              maxW="100%"
              bg="white"
              p={[2, 4, 6]}
              mb={'1rem'}
              cursor="pointer"
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
              <Box width={'13rem'}>
                <Text fontWeight="bold">{summary.name}</Text>
                <Flex
                  justifyContent="space-between"
                  mb={2}
                >
                  <Text fontSize={'10px'}>{`Start Date: ${formatDate(summary.startDate)}`}</Text>
                  <Text fontSize={'10px'}>{`End Date: ${formatDate(summary.endDate)}`}</Text>
                </Flex>
                <Text fontSize={'10px'}>{`Type: ${summary.type}`}</Text>
              </Box>
              {summary.status.toLowerCase() !== 'inactive' && (
                <Badge
                  ml="auto"
                  variant={'solid'}
                  colorScheme={summary.status.toLowerCase() === 'applied' ? 'green' : 'orange'}
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
    </Box>
  )
}

export default Policies
