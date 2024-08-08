import React, { ReactNode } from 'react'
import { Card, CardBody } from '@chakra-ui/react'

interface CancelBookingProps {
  children: ReactNode
}

const BottomDrawer: React.FC<CancelBookingProps> = ({ children }) => {
  return (
    <div className="overflow-hidden max-h-[85vh]">
      <Card
        zIndex={'999'}
        position="absolute"
        bottom={'0'}
        w="100%"
        borderRadius={'16px'}
        borderBottomLeftRadius="unset"
        borderBottomRightRadius="unset"
        boxShadow="0px -4px 16px 0px #0000001F"
      >
        <CardBody padding={'10px 20px 5px 20px'}>{children}</CardBody>
      </Card>
    </div>
  )
}

export default BottomDrawer
