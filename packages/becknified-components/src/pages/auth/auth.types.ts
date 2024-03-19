import { InputProps, ButtonProps } from '@beckn-ui/molecules'
export interface AuthProps {
  schema: {
    logo?: {
      src: string
      alt: string
    }
    inputs: InputProps[]
    buttons: ButtonProps[]
    socialButtons?: ButtonProps[]
  }
}
