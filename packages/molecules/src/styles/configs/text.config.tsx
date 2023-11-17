import { defineStyleConfig } from '@chakra-ui/react'

// Think of a way of sending and uploading font family through provider
const TextConfig = defineStyleConfig({
  baseStyle: {
    fontFamily: 'Poppins'
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
      fontSize: '17px'
    },
    titleRegular: {
      fontWeight: 'normal',
      fontSize: '17px'
    },
    subTitleSemibold: {
      fontWeight: 'semibold',
      fontSize: '15px'
    },
    subTitleRegular: {
      fontWeight: 'normal',
      fontSize: '15px'
    },
    subTextSemibold: {
      fontWeight: 'semibold',
      fontSize: '12px'
    },
    subTextRegular: {
      fontWeight: 'normal',
      fontSize: '12px'
    },
    tagSemibold: {
      fontWeight: 'semibold',
      fontSize: '11px'
    },
    tagRegular: {
      fontWeight: 'normal',
      fontSize: '11px'
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'subTextRegular'
  }
})

export default TextConfig
