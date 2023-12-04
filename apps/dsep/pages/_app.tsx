import type { AppProps } from 'next/app'

import Layout from '../components/layout/Layout'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'
import { ChakraProvider } from '@chakra-ui/react'

import '../styles/globals.css'

import { Garuda } from 'garudaa'

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
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
