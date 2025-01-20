import React from 'react'
import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import { DashboardData } from '@lib/types/dashboard'
import { testIds } from '@shared/dataTestIds'

const unitsLabelMap: Record<string, string> = {
  previous_month: 'Previous Month',
  current_month: 'Current Month',
  average: 'Average (per day)'
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
        dataTest={testIds.total_energy_unit_text}
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        columnGap="2px"
      >
        {Object.entries(dashboardTotalEnergyUnitsData).map(([key, value], index) => (
          <Input
            dataTest={testIds.total_energy_unit_input}
            name={key}
            value={value}
            key={index}
            type="text"
            handleChange={() => {
              console.log(`${key} changed`)
            }}
            disabled={true}
            label={unitsLabelMap[key]}
            rightElement={() => {
              return (
                <Box
                  cursor="pointer"
                  height="36px"
                  mt={'8px'}
                  opacity="0.4"
                >
                  <Typography
                    dataTest={testIds.total_energy_unit_unit}
                    text={'(KWh)'}
                    fontSize="15px"
                    fontWeight="400"
                  />
                </Box>
              )
            }}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default TotalEnergyUnits
