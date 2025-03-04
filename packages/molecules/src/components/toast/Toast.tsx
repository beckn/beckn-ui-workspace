import React from 'react'
import { Box, Icon, Flex, CloseButton, ComponentWithAs, IconProps } from '@chakra-ui/react'
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

const Toast: React.FC<ToastProps> = ({ status, title, description, onClose, dataTest }) => {
  const { icon, color } = (iconMap as never)[status as ToastType] || {}

  return (
    <Box
      bg="#FFFFFF"
      borderLeft="8px solid"
      borderColor={color}
      p={3}
      mt="40px"
      boxShadow="md"
      borderRadius={'10px'}
      maxW={'100%'}
      position="relative"
      data-testid="main_container"
      data-test={dataTest}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        mb="6px"
      >
        <Flex
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          {icon && (
            <Icon
              as={icon}
              w={6}
              h={6}
              color={color}
              mr={2}
              data-testid={`toast-icon-${status}`}
            />
          )}
          <Typography
            className="toast-text"
            variant="subTitleSemibold"
            text={title}
          />
        </Flex>
        <CloseButton
          onClick={onClose}
          data-testid="close-button"
          data-test="close"
        />
      </Flex>
      {description && (
        <Typography
          variant="subTitleRegular"
          text={description}
          data-testid={`toast_description`}
          style={{ marginLeft: '2rem', marginBottom: 'unset !important' }}
        />
      )}
    </Box>
  )
}

export default Toast
