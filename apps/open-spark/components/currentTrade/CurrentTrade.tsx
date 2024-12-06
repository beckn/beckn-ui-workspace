import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface CurrentTradeProps {
  data: { name: string; label: string; value: string; disabled: boolean; symbol: string }[]
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
          rightElement={() => {
            return (
              <Box
                cursor="pointer"
                height="36px"
                mt={'8px'}
              >
                <Typography text={item.symbol} />
              </Box>
            )
          }}
        />
      ))}
    </Flex>
  )
}

export default CurrentTrade
