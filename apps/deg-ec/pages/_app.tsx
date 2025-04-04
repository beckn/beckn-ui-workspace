import React from 'react'
import type { AppProps } from 'next/app'

import Layout from '@components/layout/Layout'
import { BecknProvider } from '@beckn-ui/molecules'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  // const { t } = useLanguage()

  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#F6D046',
          secondary: '#53A052',
          textPrimary: '#1A202C',
          textSecondary: '#6B7280'
        }
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </BecknProvider>
  )
}

export default MyApp
