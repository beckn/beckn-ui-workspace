import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
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
import { Box, Text, useToast } from '@chakra-ui/react'
import { feedbackActions, ToastType, FeedbackRootState } from '@beckn-ui/common/src/store'
import { Toast } from '@beckn-ui/molecules/src/components'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
  const isHomepage = router.pathname === '/homePage'
  const isHome = router.pathname === '/'
  const isSearch = router.pathname === '/search'
  const isSignUp = router.pathname === '/signUp'
  const isSearchPage = router.pathname === '/search'
  const geoLocationSearchPageVisible = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoLocationSearchPageVisible
  })
  const toast = useToast()
  const dispatch = useDispatch()
  const {
    toast: { display, message, type, description }
  } = useSelector((state: FeedbackRootState) => state.feedback)

  useEffect(() => {
    if (display) {
      toast({
        position: 'top',
        duration: 5000,
        isClosable: true,
        render: ({ onClose }) => (
          <Toast
            status={type as ToastType}
            title={message}
            description={description}
            onClose={onClose}
          />
        )
      })
      dispatch(feedbackActions.toggleToast({ display: false }))
    }
  }, [display])

  return (
    // <ThemeProvider enableSystem={true}>
    <div>
      <Head>
        <title>LegalEase</title>
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
              ${isHome ? styles.homepageMargin : ''}
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

export default Layout
