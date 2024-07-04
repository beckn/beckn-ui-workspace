import React from 'react'
import { ErrorFallback } from '@beckn-ui/becknified-components'

interface FallbackUIProps {
  handleBackToHomeClick: () => void
  handleContactSupport: () => void
  t: (key: string) => string
}

const FallbackUI: React.FC<FallbackUIProps> = ({ handleBackToHomeClick, handleContactSupport, t }) => {
  return (
    <ErrorFallback
      schema={{
        logo: {
          src: './images/bad_request_img.svg',
          alt: t('badRequest')
        },
        errorDetails: {
          type: t('badRequest'),
          description: t('errorDescription')
        },
        buttons: {
          text: t('backtoHomepage'),
          handleClick: handleBackToHomeClick
        },
        contactSupportProps: {
          text: t('contactSupport'),
          handleClick: handleContactSupport
        }
      }}
    />
  )
}

export default FallbackUI
