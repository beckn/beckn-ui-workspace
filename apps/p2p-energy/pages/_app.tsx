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
// import { Garuda } from 'garudaa'
import { PersistGate } from 'redux-persist/integration/react'
import { FallbackUI } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import Router, { useRouter } from 'next/router'
import ErrorBoundary from '@beckn-ui/common/src/components/errorBoundary'

// Garuda.init({
//   projectId: '65c0d663cbe90cafae9185f6',
//   host: 'https://garuda-api.becknprotocol.io'
// })
function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useLanguage()
  const router = useRouter()
  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#4498e8',
          secondary: '#4498e8',
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
          <ErrorBoundary
            fallback={() => (
              <FallbackUI
                handleBackToHomeClick={() => {
                  router.push('/homePage')
                }}
                handleContactSupport={() => {}}
                t={key => t[key]}
              />
            )}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </BecknProvider>
  )
}

export default MyApp
