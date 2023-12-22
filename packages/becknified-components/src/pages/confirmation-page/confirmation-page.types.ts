import { ButtonProps, LoaderProps } from '@beckn-ui/molecules'

export interface ConfirmationPageProps {
  schema: {
    iconSrc: string
    content: JSX.Element
    buttons: ButtonProps[]
    loader: LoaderProps
  }
  className?: string
  isLoading?: boolean
}
