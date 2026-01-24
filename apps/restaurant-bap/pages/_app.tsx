import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BecknProvider } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import ErrorBoundary from '@beckn-ui/common/src/components/errorBoundary'
import { FallbackUI } from '@beckn-ui/common'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import store, { persistor } from '@store/index'
import Layout from '@components/layout/Layout'
import SplashWrapper from '@components/splash/SplashWrapper'

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const translations = t as unknown as Record<string, string>
  const translate = (key: string) => translations[key] ?? key

  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#FF6B35',
          secondary: '#4A4C5A',
          textPrimary: '#212529',
          textSecondary: '#6C757D'
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
                handleBackToHomeClick={() => router.push('/')}
                handleContactSupport={() => {}}
                t={translate}
              />
            )}
          >
            <SplashWrapper>
              {router.pathname === '/signIn' || router.pathname === '/signUp' ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </SplashWrapper>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </BecknProvider>
  )
}

export default MyApp
