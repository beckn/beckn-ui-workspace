import { ButtonProps } from '@beckn-ui/molecules'

export interface ConfirmationPageProps {
  iconSrc: string
  content: JSX.Element
  buttons: ButtonProps[]
  className?: string
}
