import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
// import dynamic from 'next/dynamic'
// const web3Accounts = dynamic(() => import('@polkadot/extension-dapp'), { ssr: false });
// const web3Enable = dynamic(() => import('@polkadot/extension-dapp'), { ssr: false });

import Layout from '../components/layout/Layout'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'
import { ChakraProvider } from '@chakra-ui/react'

import '../styles/globals.css'
import { Provider } from 'react-redux'
import store from '../store/index'
import axios from 'axios'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const enableWeb3 = async () => {
      const { web3Enable, web3Accounts, web3FromSource } = await import('@polkadot/extension-dapp')
      if (typeof window !== 'undefined') {
        const enabled = await web3Enable('Social Web Example Client')
        if (enabled.length > 0) {
          const allAccounts = await web3Accounts()
          localStorage.setItem('polkaAddresses', JSON.stringify(allAccounts))
        }
      }
    }
    enableWeb3()

    // Providers api
    axios
      .get('https://api.dsnp-social-web.becknprotocol.io/v1/auth/provider')
      .then(response => {
        console.log(response.data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('provider', JSON.stringify(response.data))
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }, [])

  return (
    <ChakraProvider>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ChakraProvider>
  )
}

export default MyApp
