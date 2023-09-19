import { Flex, Image, Box, Text, Card, CardBody } from '@chakra-ui/react'
import React from 'react'

interface scholarshipListCardProps {
  scholarshipName: string
  scholarshipDetails: string
  scholarshipBy: string
  handleCardClick: () => void
}

const scholarshipListCard: React.FC<scholarshipListCardProps> = props => {
  return (
    <Box>
      <Card
        onClick={props.handleCardClick}
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody padding={'15px 20px'} fontSize="12px">
          <Text fontWeight={'600'} pb={'10px'}>
            {props.scholarshipName}
          </Text>
          <Text pb={'15px'}>{props.scholarshipDetails}</Text>

          <Text pr={'10px'}>By: {props.scholarshipBy}</Text>
        </CardBody>
      </Card>
    </Box>
  )
}

export default scholarshipListCard
