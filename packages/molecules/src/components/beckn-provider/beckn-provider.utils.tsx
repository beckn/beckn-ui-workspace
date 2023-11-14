import { extendTheme } from '@chakra-ui/react'
import { becknTheme } from '@lib/types'
import { ButtonConfig } from '../../styles/configs'

export const generateTheme = (theme: becknTheme) => {
  return extendTheme({
    components: {
      Button: ButtonConfig
    },
    colors: {
      primary: {
        100: theme.color.primary
      },
      secondary: {
        100: theme.color.secondary
      }
    }
  })
}
