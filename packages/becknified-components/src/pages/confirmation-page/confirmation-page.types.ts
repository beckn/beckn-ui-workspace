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
  dataTestConfirmImage?: string
  dataTestSuccess?: string
  dataTestGrateful?: string
  dataTestOrderId?: string
  dataTestTrackOrder?: string
}
