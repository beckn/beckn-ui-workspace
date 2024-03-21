import { defineStyleConfig } from '@chakra-ui/react'

const ButtonConfig = defineStyleConfig({
  baseStyle: {
    fontWeight: 'normal',
    borderRadius: '12px',
    marginBottom: '10px'
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 3
    },
    md: {
      fontSize: 'md',
      px: 6,
      py: 6
    }
  },
  variants: {
    outline: props => {
      const colorScheme = props.colorScheme || 'primary'
      return {
        border: '2px solid',
        color: `${colorScheme}.100`
      }
    },
    solid: props => {
      const colorScheme = props.colorScheme || 'primary'
      return {
        bg: `${colorScheme}.100`
        // color:'textSecondary.100',
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'solid'
  }
})

export default ButtonConfig
