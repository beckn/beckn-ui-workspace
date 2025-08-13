import React, { ReactNode } from 'react'
import { Box, Card, CardBody } from '@chakra-ui/react'

interface DetailsCardProps {
  children: ReactNode
  isDisabled?: boolean
}

const DetailsCard: React.FC<DetailsCardProps> = props => {
  return (
    <>
      <Card
        mb={'20px'}
        boxShadow={'0px 8px 40px 0px #0000001A'}
        borderRadius={'12px'}
        opacity={props.isDisabled ? 0.5 : 'unset'}
        pointerEvents={props.isDisabled ? 'none' : 'auto'}
      >
        <CardBody padding={'15px 20px'}>
          <Box>{props.children}</Box>
        </CardBody>
      </Card>
    </>
  )
}

export default DetailsCard
