import { generateTheme } from './beckn-provider.utils'
import { becknTheme } from '../../lib/types'
import { ReactNode } from 'react'

export interface BecknProivderProps {
  theme: becknTheme
  children: ReactNode
}

//TODO Custom theme typing is not working
export type CustomThemeType = ReturnType<typeof generateTheme>
