import React from 'react'
import type { AppProps } from 'next/app'

import Layout from '@components/layout/Layout'
import { BecknProvider } from '@beckn-ui/molecules'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'

import '../styles/globals.css'
import { Provider } from 'react-redux'
import store from '@store/index'
import { Garuda } from 'garudaa'

Garuda.init({
  projectId: '65c0d663cbe90cafae9185f6',
  host: 'https://garuda-api.becknprotocol.io'
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#0560FA',
          secondary: '#84B3F9',
          textPrimary: '#1A202C',
          textSecondary: '#6B7280'
        }
      }}
    >
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </BecknProvider>
  )
}

export default MyApp
