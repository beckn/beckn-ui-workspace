import { ButtonProps } from '@beckn-ui/molecules'
export interface ErrorFallbackProps {
  schema: {
    logo?: {
      src: string
      alt: string
    }
    errorDetails: {
      type: string
      description?: string | null
    }
    buttons: ButtonProps
    contactSupportProps?: {
      handleClick: React.MouseEventHandler<HTMLDivElement> | undefined
      text: string
    }
  }
}
