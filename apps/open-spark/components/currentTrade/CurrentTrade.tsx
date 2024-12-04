import { Input } from '@beckn-ui/molecules'
import { Flex } from '@chakra-ui/react'
import React from 'react'

const CurrentTrade = ({ mockData }) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      columnGap={'20px'}
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
  )
}

export default CurrentTrade
