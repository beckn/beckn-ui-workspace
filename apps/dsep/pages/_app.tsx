import type { AppProps } from 'next/app'

import Layout from '../components/layout/Layout'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'
import { ChakraProvider } from '@chakra-ui/react'

import '../styles/globals.css'

import store from '../store/index'
import { Garuda } from 'garudaa'
import { BecknProvider } from '@beckn-ui/molecules'
import { Provider } from 'react-redux'
import { persistor } from '../store'
import { PersistGate } from 'redux-persist/integration/react'

Garuda.init({
  projectId: '656dad5ed5a5a7d831fc43ac',
  host: 'https://garuda-api.becknprotocol.io',
  globalConfigFlags: {
    disableNetworkPayload: true
  }
})

Garuda.identify({
  email: 'ujjwal.tiwari@eminds.ai',
  name: 'Ujjwal',
  uId: ''
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BecknProvider
      theme={{
        color: {
          primary: '#3AA5E1',
          secondary: '#84B3F9'
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
