import { InputProps, ButtonProps, LoaderProps } from '@beckn-ui/molecules'
export interface AuthProps {
  schema: {
    logo?: {
      src: string
      alt: string
    }
    chooseAuthType?: {
      id: string
      src: string
      alt: string
      label?: string
    }[]
    handleAccountType?: (type: string) => void
    inputs: InputProps[]
    buttons: ButtonProps[]
    socialButtons?: ButtonProps[]
    loader?: LoaderProps
  }
  isLoading?: boolean
  dataTestForm?: string
}
