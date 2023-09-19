import { Box, Card, CardBody, Flex, Text } from '@chakra-ui/react'
import React, { FC } from 'react'

interface ScholarshipCardProps {
  heading: string
  time: string
  id: string
  review: string
}

const ScholarshipCard: FC<ScholarshipCardProps> = props => {
  return (
    <Box>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody padding={'15px 20px'} fontSize="12px">
          <Text fontWeight={'600'} pb={'10px'}>
            {props.heading}
          </Text>
          <Text pb={'5px'}>{props.time}</Text>
          <Flex alignItems={'center'} justifyContent="space-between">
            <Text pr={'10px'}>ID: {props.id}</Text>
            <Text>{props.review}</Text>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default ScholarshipCard
