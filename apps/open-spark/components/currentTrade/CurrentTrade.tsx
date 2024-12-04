import { Input } from '@beckn-ui/molecules'
import { Flex } from '@chakra-ui/react'
import React from 'react'

interface CurrentTradeProps {
  data: { name: string; label: string; value: string; disabled: boolean }[]
}

const CurrentTrade = (props: CurrentTradeProps) => {
  const { data } = props
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      columnGap={'20px'}
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
  )
}

export default CurrentTrade
