import React from 'react'
import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'

export interface DashboardData {
  previous_month: number
  current_month: number
  average: number
}

interface TotalEnergyUnitsProps {
  dashboardTotalEnergyUnitsData: DashboardData
}

const TotalEnergyUnits: React.FC<TotalEnergyUnitsProps> = ({ dashboardTotalEnergyUnitsData }) => {
  return (
    <Box>
      <Typography
        text="Total Energy Units"
        fontSize="15px"
        fontWeight="600"
        sx={{
          marginBottom: '10px'
        }}
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        columnGap="2px"
      >
        {Object.entries(dashboardTotalEnergyUnitsData).map(([key, value], index) => (
          <Input
            value={value}
            key={index}
            type="text"
            handleChange={() => {
              console.log(`${key} changed`)
            }}
            disabled={true}
            label={key.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default TotalEnergyUnits
