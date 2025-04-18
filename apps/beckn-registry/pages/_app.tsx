import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { store } from '../store/store'
import { ToastProvider } from '../components/Toast'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ToastProvider>
    </Provider>
  )
}

export default MyApp
