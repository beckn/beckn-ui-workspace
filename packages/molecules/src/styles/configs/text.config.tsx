import { defineStyleConfig } from '@chakra-ui/react'

// Think of a way of sending and uploading font family through provider
const TextConfig = defineStyleConfig({
  baseStyle: {
    fontFamily: 'Poppins',
    color: 'text.200'
  },
  sizes: {
    xl: {
      fontSize: '17px'
    },
    lg: {
      fontSize: '15px'
    },
    md: {
      fontSize: '12px'
    },
    sm: {
      fontSize: '11px'
    }
  },
  variants: {
    titleSemibold: {
      fontWeight: 'semibold',
      fontSize: '17px',
      color: 'text.200'
    },
    titleRegular: {
      fontWeight: 'normal',
      fontSize: '17px',
      color: 'text.200'
    },
    subTitleSemibold: {
      fontWeight: 'semibold',
      fontSize: '15px',
      color: 'text.200'
    },
    subTitleRegular: {
      fontWeight: 'normal',
      fontSize: '15px',
      color: 'text.200'
    },
    subTextSemibold: {
      fontWeight: 'semibold',
      fontSize: '12px',
      color: 'text.200'
    },
    subTextRegular: {
      fontWeight: 'normal',
      fontSize: '12px',
      color: 'text.200'
    },
    tagSemibold: {
      fontWeight: 'semibold',
      fontSize: '11px',
      color: 'text.200'
    },
    tagRegular: {
      fontWeight: 'normal',
      fontSize: '11px',
      color: 'text.200'
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'subTextRegular'
  }
})

export default TextConfig
