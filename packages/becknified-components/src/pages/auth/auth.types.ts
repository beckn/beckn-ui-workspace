import { InputProps, ButtonProps, LoaderProps, TypographyProps } from '@beckn-ui/molecules'
export interface AuthProps {
  schema: {
    logo?: {
      src: string
      alt: string
    }
    inputs: InputProps[]
    buttons: ButtonProps[]
    socialButtons?: ButtonProps[]
    loader?: LoaderProps
    forgotPassword?: TypographyProps
  }
  isLoading?: boolean
}
