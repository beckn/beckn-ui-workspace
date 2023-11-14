import { defineStyleConfig } from '@chakra-ui/react'

const ButtonConfig = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: 'bold',
    borderRadius: 'base', // <-- border radius is same for all variants and sizes
    marginBottom: '10px'
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3 // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4 // <-- these values are tokens from the design system
    }
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'primary.100',
      color: 'primary.100'
    },
    solid: {
      bg: 'primary.100',
      color: 'white'
    }
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'solid'
  }
})

export default ButtonConfig
