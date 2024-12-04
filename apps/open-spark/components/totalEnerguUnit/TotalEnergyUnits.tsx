import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import Styles from './totalEnergyUnits.module.css'

const TotalEnergyUnits = ({ mockData }) => {
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
        {mockData.map((item, index) => (
          <Input
            value={item.value}
            key={index}
            type="text"
            handleChange={() => {
              console.log(`${item.label} changed`)
            }}
            label={`${item.label}`}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default TotalEnergyUnits
