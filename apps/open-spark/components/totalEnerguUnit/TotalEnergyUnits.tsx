import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import Styles from './totalEnergyUnits.module.css'

interface TotalEnergyUnitsProps {
  data: { name: string; label: string; value: string; disabled: boolean }[]
}

const TotalEnergyUnits = (props: TotalEnergyUnitsProps) => {
  const { data } = props
  return (
    <Box>
      <Typography
        text={'Total Energy Units'}
        fontSize="15px"
        fontWeight="600"
        sx={{
          marginBottom: '10px'
        }}
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        columnGap={'2px'}
      >
        {data.map((item, index) => (
          <Input
            name={item.name}
            value={item.value}
            key={index}
            type="text"
            handleChange={() => {
              console.log(`${item.label} changed`)
            }}
            label={`${item.label}`}
            disabled={item.disabled}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default TotalEnergyUnits
