import React from 'react'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'
import { BecknProvider } from '@beckn-ui/molecules'
import { Provider } from 'react-redux'
import store, { persistor } from '@store/index'
import ErrorBoundary from '@beckn-ui/common/src/components/errorBoundary'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { FallbackUI } from '@beckn-ui/common'
import { PersistGate } from 'redux-persist/integration/react'

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useLanguage()
  const router = useRouter()
  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#54b86a',
          secondary: '#48a35d',
          textPrimary: '#333333',
          textSecondary: '#888888'
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
                  router.push('/')
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
