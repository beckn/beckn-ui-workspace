import { ButtonProps } from '@beckn-ui/molecules'

export interface ConfirmationPageProps {
  schema: {
    iconSrc: string
    content: string
    contentMessage: string
    buttons: ButtonProps[]
  }
  className?: string
}
