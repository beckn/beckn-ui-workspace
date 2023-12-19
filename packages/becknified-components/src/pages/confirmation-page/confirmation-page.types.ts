import { ButtonProps, LoaderProps } from '@beckn-ui/molecules'

export interface ConfirmationPageProps {
  schema: {
    iconSrc: string
    content: string
    contentMessage: string
    buttons: ButtonProps[]
    loader: LoaderProps
  }
  className?: string
  isLoading?: boolean
}
