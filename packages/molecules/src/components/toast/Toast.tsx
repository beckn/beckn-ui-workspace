import React from 'react'
import { useToast, Box, Icon, Flex, CloseButton, ComponentWithAs, IconProps } from '@chakra-ui/react'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { FaCircleXmark } from 'react-icons/fa6'
import { ToastProps, ToastType } from './Toast-type'
import Typography from '../typography/typography'
import { IconType } from 'react-icons/lib'

const iconMap: {
  success: {
    icon: ComponentWithAs<'svg', IconProps>
    color: string
  }
  error: {
    icon: IconType
    color: string
  }
  warning: {
    icon: ComponentWithAs<'svg', IconProps>
    color: string
  }
} = {
  success: { icon: CheckCircleIcon, color: 'green.500' },
  error: { icon: FaCircleXmark, color: 'red.500' },
  warning: { icon: WarningIcon, color: 'yellow.500' }
}

const Toast: React.FC<ToastProps> = ({ status, title, description }) => {
  const toast = useToast()
  console.log(status, title, description)
  const { icon, color } = (iconMap as never)[status as ToastType] || {}
  React.useEffect(() => {
    if (status && title) {
      toast({
        position: 'top',
        duration: 5000,
        isClosable: true,
        render: ({ onClose }) => (
          <Box
            display="flex"
            alignItems="center"
            bg="#FFFFFF"
            borderLeft="8px solid"
            borderColor={color}
            p={4}
            mt="40px"
            boxShadow="md"
            borderRadius={'10px'}
            maxW={'100%'}
            position="relative"
            data-testid="main_container"
          >
            <CloseButton
              position="absolute"
              right="0px"
              top="0px"
              onClick={onClose}
              data-testid="close-button"
            />
            {icon && (
              <Icon
                as={icon}
                w={6}
                h={6}
                color={color}
                mr={3}
                data-testid={`toast-icon-${status}`}
              />
            )}
            <Flex
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={'column'}
            >
              <Typography
                variant="subTitleSemibold"
                text={title}
              />
              {description && (
                <Typography
                  variant="subTitleRegular"
                  text={description}
                  data-testid={`toast_description`}
                />
              )}
            </Flex>
          </Box>
        )
      })
    }
  }, [status, title, description, toast, icon, color])

  return null
}

export default Toast
