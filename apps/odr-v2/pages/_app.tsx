import React from 'react'
import type { AppProps } from 'next/app'

import Layout from '@components/layout/Layout'
import { BecknProvider } from '@beckn-ui/molecules'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'

import '../styles/globals.css'
import { Provider } from 'react-redux'
import store, { persistor } from '@store/index'
import { Garuda } from 'garudaa'
import { PersistGate } from 'redux-persist/integration/react'

Garuda.init({
  projectId: '65c0d663cbe90cafae9185f6',
  host: 'https://garuda-api.becknprotocol.io'
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#8D353A',
          secondary: '#53A052',
          textPrimary: '#1A202C',
          textSecondary: '#6B7280'
        }
      }}
    >
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </BecknProvider>
  )
}

export default MyApp
