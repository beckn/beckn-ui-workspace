import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'
import { BecknProvider } from '@beckn-ui/molecules'
import { Provider } from 'react-redux'
import store from 'store'
function MyApp({ Component, pageProps }: AppProps) {
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
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </BecknProvider>
  )
}
export default MyApp
