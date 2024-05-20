import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'

import Layout from '@components/layout/Layout'
import { BecknProvider } from '@beckn-ui/molecules'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'react-toastify/dist/ReactToastify.css'

import '../styles/globals.css'
import { Provider } from 'react-redux'
import store, { persistor } from '@store/index'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { parentURLs } from '@lib/config'
// import { Garuda } from 'garudaa'
import { PersistGate } from 'redux-persist/integration/react'
import { CustomToast } from '@components/signIn/SignIn'

// Garuda.init({
//   projectId: '65c0d663cbe90cafae9185f6',
//   host: 'https://garuda-api.becknprotocol.io'
// })

function MyApp({ Component, pageProps }: AppProps) {
  const toast = useToast()

  useEffect(() => {
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
      .get(`${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/v1/auth/provider`)
      .then(response => {
        console.log(response.data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('provider', JSON.stringify(response.data))
        }
      })
      .catch(error => {
        console.error('There was an error!', error)
        toast({
          render: () => (
            <CustomToast
              title="Error!"
              message="Unable to fetch the dsnp providers"
            />
          ),
          position: 'top',
          duration: 2000,
          isClosable: true
        })
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
    <BecknProvider
      theme={{
        color: {
          primary: '#F37A20',
          secondary: '#F37A20',
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
