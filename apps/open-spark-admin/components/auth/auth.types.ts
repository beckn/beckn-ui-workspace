import { InputProps, ButtonProps, LoaderProps } from '@beckn-ui/molecules'
export interface AuthProps {
  schema: {
    logo?: {
      src: string
      alt: string
      description?: string
    }
    formName?: string
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
    showTermsCheckbox?: boolean
    termsCheckboxProps?: {
      isChecked: boolean
      color?: string
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
      termsText: {
        serviceName: string
        termsLink: string
        privacyLink: string
      }
    }
  }
  isLoading?: boolean
  dataTestForm?: string
  customComponent?: React.ReactElement<any, any> | null
}
