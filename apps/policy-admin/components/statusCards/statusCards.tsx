import React from 'react'
import { Box, Grid, Text } from '@chakra-ui/react'
import { StatusCardRootProps } from '@pages/index'

interface StatusCardProps {
  count: number
  label: string
  dataTest: string
}

const StatusCard = (props: StatusCardProps) => {
  const { count, label, dataTest } = props
  return (
    <Box
      // width="calc(100vw / 4)"
      borderWidth="1px"
      borderRadius="10px !important"
      border={'1px solid #004e9280'}
      padding="4"
      transition={'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}
      boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
      textAlign="center"
      height={{ base: 'unset', md: '9rem' }}
      color={'rgba(0, 0, 0, 0.87)'}
      alignContent={'center'}
    >
      <Box
        fontSize={{ base: 'xl', md: '3xl' }}
        fontWeight="bold"
        bgGradient={'linear(180deg, #000428 0%, #004e92 100%) !important'}
        bgClip="text"
        data-test={dataTest}
      >
        {count}
      </Box>
      <Text
        color={'#3e4059'}
        fontWeight="400"
        fontSize={{ base: '12px', md: '0.875rem' }}
        data-test={label}
      >
        {label}
      </Text>
    </Box>
  )
}

const StatusCards = (props: StatusCardRootProps) => {
  const { active, inactive, published } = props
  return (
    <Grid
      templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' }}
      gap={{ base: '5', md: '10' }}
      mb={8}
    >
      <StatusCard
        count={active}
        label="Active"
        dataTest={'active'}
      />
      <StatusCard
        count={inactive}
        label="Inactive"
        dataTest={'Inactive'}
      />
      <StatusCard
        count={published}
        label="Published"
        dataTest={'Published'}
      />
    </Grid>
  )
}

export default StatusCards
