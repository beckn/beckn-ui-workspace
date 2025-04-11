import React from 'react'
import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react'

type TextAlignType = 'start' | 'center' | 'end'

interface BecknButtonProps extends ButtonProps {
  text?: string
  prefixIcon?: React.ReactNode
  postIcon?: React.ReactNode
  textStyle?: TextAlignType
  handleClick?: () => void
  dataTest?: string
}

const ShadowCardButton: React.FC<BecknButtonProps> = ({
  text,
  prefixIcon,
  postIcon,
  textStyle = 'start',
  handleClick,
  isLoading = false,
  loadingText = 'Loading',
  disabled = false,
  colorScheme = 'primary',
  variant = 'unstyled',
  id,
  className,
  dataTest,
  ...props
}) => {
  return (
    <Button
      id={id}
      onClick={handleClick}
      className={`border_radius_all ${className}`}
      isDisabled={disabled}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={colorScheme}
      variant={variant}
      data-test={dataTest}
      {...props}
    >
      {prefixIcon && (
        <Flex
          mr={3}
          fontSize="lg"
        >
          {prefixIcon}
        </Flex>
      )}
      <Flex
        flex="1"
        justifyContent={textStyle}
      >
        <Text
          fontSize="md"
          fontWeight="medium"
          color="black"
        >
          {text}
        </Text>
      </Flex>
      {postIcon && (
        <Flex
          ml={3}
          fontSize="lg"
        >
          {postIcon}
        </Flex>
      )}
    </Button>
  )
}

export default ShadowCardButton
