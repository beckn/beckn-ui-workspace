import { Box } from '@chakra-ui/react'
import React from 'react'

interface LandingIframeProps {
  url: string
  title: string
}

const LandingIframe: React.FC<LandingIframeProps> = ({ url, title }) => {
  return (
    <div className="smartphone-wrapper">
      <div className="smartphone">
        <div className="content">
          {url && (
            <iframe
              className="ChooseExpIframe"
              allow="clipboard-read; clipboard-write; geolocation; camera; fullscreen"
              src={url}
              frameBorder="0"
              allowFullScreen
              scrolling={'no'}
              width={'100%'}
              height={'100%'}
              style={{ borderRadius: '36px' }}
              loading="eager"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default LandingIframe
