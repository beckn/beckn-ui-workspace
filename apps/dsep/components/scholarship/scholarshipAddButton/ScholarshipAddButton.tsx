import { Box, Card, CardBody, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'

interface ScholarshipAddButtonProps {
  image?: string
  text: string
  handleButtonClick: () => void
}

const ScholarshipAddButton: React.FC<ScholarshipAddButtonProps> = props => {
  return (
    <Box cursor={'pointer'}>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody padding={'15px 20px'} onClick={props.handleButtonClick} cursor="pointer">
          <Flex alignItems={'center'}>
            {/* <Image src={props.image} /> */}
            <Text pr={'10px'}>{props.image}</Text>
            <Text fontSize={'15px'}> {props.text}</Text>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default ScholarshipAddButton
