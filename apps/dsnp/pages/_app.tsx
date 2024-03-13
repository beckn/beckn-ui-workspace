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
import { parentURLs } from '@utils/polka'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // if (typeof window !== 'undefined') {
    //   localStorage.setItem(
    //     'dsnpAuth',
    //     JSON.stringify({
    //       accessToken: '3918010f-eb34-4450-a037-0495781e0231',
    //       expires: 1704377141680,
    //       dsnpId: '27'
    //     })
    //   )
    // }

    const enableWeb3 = async () => {
      const { web3Enable, web3Accounts, web3FromSource } = await import('@polkadot/extension-dapp')
      if (typeof window !== 'undefined') {
        if (window.location !== window.parent.location) {
          window.parent.postMessage({ type: 'enablePolka' }, '*')
        } else {
          const enabled = await web3Enable('Social Web Example Client')
          if (enabled.length > 0) {
            const allAccounts = await web3Accounts()
            localStorage.setItem('polkaAddresses', JSON.stringify(allAccounts))
          }
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

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!parentURLs.includes(event.origin)) return
      if (event.data.type && event.data.type === 'polkaAccounts') {
        const allAccounts = event.data.data
        console.log('From EC', allAccounts)
        localStorage.setItem('polkaAddresses', JSON.stringify(allAccounts))
        // if(!localStorage.getItem('polkaAddresses')) window.location.reload()
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
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
