import { InputProps, ButtonProps, LoaderProps } from '@beckn-ui/molecules'
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
  }
  isLoading?: boolean
}
