import React from 'react'
import { Provider, useSelector } from 'react-redux'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import Header from '../header'
import store from '../../store/index'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import NextNProgress from 'nextjs-progressbar'
import styles from './Layout.module.css'
import { IGeoLocationSearchPageRootState } from '@lib/types/geoLocationSearchPage'
import GeoLocationInputList from '@components/geoLocationInput/GeoLocationInputList'
import { Box, Text } from '@chakra-ui/react'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
  const isHomepage = router.pathname === '/homePage'
  const isSearch = router.pathname === '/search'
  const isSignUp = router.pathname === '/signUp'
  const isSearchPage = router.pathname === '/search'
  const geoLocationSearchPageVisible = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoLocationSearchPageVisible
  })

  return (
    // <ThemeProvider enableSystem={true}>
    <div>
      <Head>
        <title>LOCALEE OPEN</title>
      </Head>
      <div className={`${styles.container} ${isHomepage ? styles.homepage : styles.minHeight}`}>
        <NextNProgress height={7} />
        <Header />
        {!geoLocationSearchPageVisible ? (
          <Box
            maxW={['unset', 'unset', 'unset', '70rem']}
            w="100%"
            margin="0 auto"
            className={`${styles.main} ${!isHomepage ? styles.withPadding : ''} ${
              !isHomepage && !isSearch ? styles.withMargin : ''
            } ${isHomepage ? styles.homepageMargin : isSearch ? styles.searchMargin : ''} 
               ${isSignUp ? styles.withMarginSignUp : ''} 
              ${isSearchPage ? styles.searchPageMargin : ''}
              `}
          >
            {children}
          </Box>
        ) : (
          <GeoLocationInputList></GeoLocationInputList>
        )}
      </div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        rtl={locale === 'en' ? false : true}
        position={locale === 'en' ? 'top-right' : 'top-left'}
      />
    </div>
    // </ThemeProvider>
  )
}

export const CustomToast: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <Box
    mt="2rem"
    p={4}
    bg="red.500"
    color="white"
    borderRadius="md"
    boxShadow="md"
  >
    <Text
      fontWeight={700}
      fontSize={'15px'}
      color={'white'}
      textAlign={'center'}
    >
      {title}
    </Text>
    <Text
      fontWeight={500}
      fontSize={'15px'}
      color={'white'}
      textAlign={'center'}
    >
      {message}
    </Text>
  </Box>
)

export default Layout
