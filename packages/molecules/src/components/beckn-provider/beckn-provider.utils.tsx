import { extendTheme } from '@chakra-ui/react'
import { becknTheme } from '../../lib/types'
import { ButtonConfig, TextConfig } from '../../styles/configs'

export const generateTheme = (theme: becknTheme) => {
  const customTheme = extendTheme({
    components: {
      Button: ButtonConfig,
      Text: TextConfig
    },
    colors: {
      primary: {
        100: theme.color.primary
      },
      secondary: {
        100: theme.color.secondary
      },
      text: {
        100: theme.color.textSecondary,
        200: theme.color.textPrimary
      }
    }
  })

  return customTheme
}
