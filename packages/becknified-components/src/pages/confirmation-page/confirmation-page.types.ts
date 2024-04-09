import { ButtonProps } from '@beckn-ui/molecules'

export interface ConfirmationPageProps {
  schema: {
    iconSrc: string
    buttons: ButtonProps[]
    successOrderMessage: string
    gratefulMessage: string
    orderIdMessage?: string
    trackOrderMessage?: string
  }
  className?: string
}
