import React, { ReactNode, useState } from 'react'
import { Box, Card, CardBody, Image } from '@chakra-ui/react'
import crossIcon from '@public/images/Indicator.svg'

interface CancelBookingProps {
  children: ReactNode
}

const BottomDrawer: React.FC<CancelBookingProps> = ({ children }) => {
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
        className={`transition-all ease-in-out duration-500 ${
          isMinimized ? 'max-h-[10vh] overflow-hidden' : 'max-h-[85vh]'
        }`}
      >
        <Box
          alignSelf={'center'}
          height="1rem"
          onClick={handleHeaderClick}
        >
          <Image
            src={crossIcon}
            alt="Close Icon"
            width={'4rem'}
            alignSelf={'center'}
          />
        </Box>

        <CardBody padding={'10px 20px 5px 20px'}>{children}</CardBody>
      </Card>
    </div>
  )
}

export default BottomDrawer
