import React, { ReactNode } from 'react'
import { Box, Card, CardBody, Text } from '@chakra-ui/react'

interface DetailsCardProps {
  children: ReactNode
}

const DetailsCard: React.FC<DetailsCardProps> = props => {
  return (
    <>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody padding={'15px 20px'}>
          <Box>{props.children}</Box>
        </CardBody>
      </Card>
    </>
  )
}

export default DetailsCard
