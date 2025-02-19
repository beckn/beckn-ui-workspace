import { Typography } from '@beckn-ui/molecules'
import { Box, Card, CardBody, Flex } from '@chakra-ui/react'
import React from 'react'
interface DetailRow {
  label: string
  value: string
}

interface OrderSummaryProps {
  detailRows: DetailRow[]
  preferences: string[]
}

const OrderSummary = ({ detailRows, preferences }: OrderSummaryProps) => {
  return (
    <Card
      className="border_radius_all"
      margin="10px"
      boxShadow={'0px 10px 14px 0px #0000001A'}
    >
      <CardBody
        padding={'20px 15px'}
        h="54px"
      >
        <Typography
          text="Order Summary"
          fontSize="17px"
          fontWeight="600"
          sx={{ mb: '10px' }}
        />

        <Flex
          direction="column"
          gap={4}
        >
          {detailRows.map((row, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
            >
              <Typography
                text={row.label}
                color="#282828"
                fontSize="12px"
                fontWeight="400"
              />
              <Typography
                text={row.value}
                color="#282828"
                fontSize="12px"
                fontWeight="400"
              />
            </Flex>
          ))}

          <Box mt={2}>
            <Typography
              text="Selected Preferences"
              color="#282828"
              fontSize="12px"
              fontWeight="400"
              sx={{ mb: '5px' }}
            />
            <Flex
              gap={3}
              flexWrap="wrap"
            >
              {preferences.map((pref, index) => (
                <Box
                  key={index}
                  border="1px solid #000000"
                  borderRadius="8px"
                  padding={'5px 10px'}
                >
                  <Typography
                    text={pref}
                    color="#282828"
                    fontSize="12px"
                    fontWeight="400"
                  />
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default OrderSummary
