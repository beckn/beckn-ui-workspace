import React from 'react'
import { Box, Text, Flex, HStack } from '@chakra-ui/react'
import Image from 'next/image'
import { ChargingSession } from '@lib/types/orderHistory'
import ActiveIcon from '@public/images/active_charging.svg'
import CompletedIcon from '@public/images/completed_charging.svg'
import { currencyMap } from '@lib/config'
import { getCountryCode } from '@utils/general'
import { useRouter } from 'next/router'

interface ChargingSessionCardProps {
  session: ChargingSession
}

const ChargingSessionCard = ({ session }: ChargingSessionCardProps) => {
  const router = useRouter()

  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={3}
      shadow="md"
      mb={4}
      border="1px"
      borderColor="gray.100"
      onClick={() => {
        router.push(`/orderDetails`)
      }}
    >
      <HStack justifyContent={'space-between'}>
        <Box
          position="relative"
          width="70px"
          height="70px"
        >
          <Image
            src={session.status === 'In Progress' ? ActiveIcon : CompletedIcon}
            alt="charging_icon"
            layout="fill"
            objectFit="contain"
          />
        </Box>
        <Box w={['100%', '100%', '50%', '50%']}>
          <Flex
            justify="space-between"
            align="center"
            mb={2}
          >
            <Text
              fontSize="14px"
              fontWeight="400"
            >
              {session.name}
            </Text>
            <Box
              bgColor={session.status === 'In Progress' ? '#FFF9CC' : '#D2F9EA'}
              padding={'4px 6px'}
              borderRadius="4px"
            >
              <Text
                fontSize="10px"
                fontWeight="400"
                whiteSpace="nowrap"
                color={session.status === 'In Progress' ? '#807000' : '#11704C'}
              >
                {session.status}
              </Text>
            </Box>
          </Flex>
          {session.type && session.type !== '' && (
            <Flex
              justify="space-between"
              mb={2}
            >
              <Text color="#858383">Type</Text>
              <Text color={'#858383'}>{session.type}</Text>
            </Flex>
          )}
          {session.duration && session.duration !== '' && (
            <Flex
              justify="space-between"
              mb={2}
            >
              <Text color="#858383">Duration</Text>
              <Text color={'#858383'}>{session.duration}</Text>
            </Flex>
          )}
          <Flex
            justify="space-between"
            mb={2}
          >
            <Text color="#858383">Cost</Text>
            <Text color={'#858383'}>
              {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
              {Number(session.cost).toFixed(2)}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="#858383">Date</Text>
            <Text color={'#858383'}>{session.date}</Text>
          </Flex>
        </Box>
      </HStack>
    </Box>
  )
}

export default ChargingSessionCard
