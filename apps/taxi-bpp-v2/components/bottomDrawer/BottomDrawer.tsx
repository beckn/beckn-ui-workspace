import React, { ReactElement, ReactNode, useState } from 'react'
import { Box, Card, CardBody, Divider, Flex, Image } from '@chakra-ui/react'
import crossIcon from '@public/images/Indicator.svg'

interface CancelBookingProps {
  title: string | ReactElement
  children: ReactNode
}

const BottomDrawer: React.FC<CancelBookingProps> = ({ children, title }) => {
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
        transition="all 0.5s ease-in-out"
        maxH={`${isMinimized ? '10vh' : '85vh'}`}
      >
        <Box
          alignSelf={'center'}
          height="1rem"
          onClickCapture={handleHeaderClick}
        >
          <Image
            src={crossIcon}
            alt="Close Icon"
            width={'4rem'}
            alignSelf={'center'}
          />
        </Box>

        <CardBody padding={'5px 20px'}>
          {
            <>
              {title && (
                <>
                  <Flex
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    padding={'2px 0px 15px 0px'}
                  >
                    <Box
                      fontSize={'17px'}
                      fontWeight="400"
                      w={'100%'}
                    >
                      {title!}
                    </Box>
                  </Flex>

                  <Box>
                    <Divider
                      borderBottomWidth="0px"
                      padding={'4px'}
                      backgroundImage="linear-gradient(to right, #00000033 0 50%, transparent 50% 100%)"
                      backgroundRepeat={'repeat no-repeat'}
                      backgroundSize="6% 1px"
                    />
                  </Box>
                </>
              )}
              {children}
            </>
          }
        </CardBody>
      </Card>
    </div>
  )
}

export default BottomDrawer
