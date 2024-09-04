import { Button, ButtonProps } from '@chakra-ui/react'

interface CommonButtonProps extends ButtonProps {
  variant?: 'outline' | 'solid'
  colorScheme?: string
  bgGradient?: string
  onClick?: () => void
  text: string
}

const CommonButton: React.FC<CommonButtonProps> = ({
  variant = 'solid',
  colorScheme,
  bgGradient,
  onClick,
  text,
  ...props
}) => {
  const isOutline = variant === 'outline'

  return (
    <Button
      color={isOutline ? '#0D0C0C' : 'white'}
      width="239px"
      height="48px"
      borderRadius="unset"
      variant={isOutline ? 'outline' : 'solid'}
      border={isOutline ? '0.5px solid' : 'none'}
      _hover={!isOutline ? { opacity: 0.9 } : {}}
      sx={{
        ...(bgGradient &&
          !isOutline && {
            bgGradient: bgGradient,
            borderColor: bgGradient
          })
      }}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  )
}

export default CommonButton
