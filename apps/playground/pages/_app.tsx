import React from 'react'
import type { AppProps } from 'next/app'

import Layout from '../components/layout/Layout'
import { BecknProvider } from '@beckn-ui/molecules'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#A71B4A',
          secondary: '#4a4c5a'
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
