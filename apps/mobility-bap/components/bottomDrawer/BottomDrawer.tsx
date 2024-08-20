import React, { ReactNode, useState } from 'react'
import { Card, CardBody, Image } from '@chakra-ui/react'
import crossIcon from '@public/images/Indicator.svg'

interface CancelBookingProps {
  children: ReactNode
  minimizationRequired?: boolean
}

const BottomDrawer: React.FC<CancelBookingProps> = ({ children, minimizationRequired = false }) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false)

  // Toggle the minimized state
  const handleHeaderClick = () => {
    setIsMinimized(prev => !prev)
  }

  return (
    <div className="overflow-hidden max-h-[85vh]">
      <Card
        zIndex={'999'}
        position="absolute"
        bottom={'0'}
        left={0}
        w="100%"
        borderRadius={'16px'}
        borderBottomLeftRadius="unset"
        borderBottomRightRadius="unset"
        boxShadow="0px -4px 16px 0px #0000001F"
        pos={'fixed'}
        className={`${isMinimized ? 'h-[20vh]' : undefined}`}
      >
        {minimizationRequired && (
          <Image
            src={crossIcon}
            alt="Close Icon"
            width={'4rem'}
            alignSelf={'center'}
            onClick={handleHeaderClick}
          />
        )}
        <CardBody padding={'10px 20px 5px 20px'}>{children}</CardBody>
      </Card>
    </div>
  )
}

export default BottomDrawer
