import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../header'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Layout.module.css'
import NextNProgress from 'nextjs-progressbar'
import { IGeoLocationSearchPageRootState } from '@beckn-ui/common/lib/types'
import { Box, useToast } from '@chakra-ui/react'
import {
  checkoutActions,
  checkTokenExpiry,
  feedbackActions,
  FeedbackRootState,
  GeoLocationInputList,
  ToastType
} from '@beckn-ui/common'
import { Toast } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'
import Splash from '../splash/splash'
import Cookies from 'js-cookie'
import { AuthRootState, logout } from '@store/auth-slice'
import BottomNavigator from '@components/BottomNavigator/BottomNavigator'

const bottomNavigatorWhiteList = ['/', '/orderHistory', '/profile']

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
  const isHome = router.pathname === '/'
  const signIn = router.pathname === '/signIn'
  const isHomepage = router.pathname === '/'
  const isSearch = router.pathname === '/search'
  const isSignUp = router.pathname === '/signUp'
  const isSearchPage = router.pathname === '/search'
  const geoLocationSearchPageVisible = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoLocationSearchPageVisible
  })

  const toast = useToast()
  const dispatch = useDispatch()

  const { user } = useSelector((state: AuthRootState) => state.auth)
  const {
    toast: { display, message, type, description }
  } = useSelector((state: FeedbackRootState) => state.feedback)

  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (!['/signIn', '/signUp', '/OTPVerification'].includes(router.pathname)) {
      const token = Cookies.get('authToken')
      let message = ''

      try {
        const isExpired: any = checkTokenExpiry(token)
        if (isExpired || !user) message = 'Token expired, please log in again!'
      } catch (error) {
        console.error('Token decoding error:', error)
        message = 'Token decode failed, please log in again!'
      } finally {
        if (message) {
          alert(message)
          // if (userConfirmed) {
          dispatch(checkoutActions.clearState())
          dispatch(logout())
          // }
        }
      }
    }
  }, [router])

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
            dataTest={testIds.feedback}
          />
        )
      })
      dispatch(feedbackActions.toggleToast({ display: false }))
    }
  }, [display])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Show splash screen for first 2 seconds
  if (showSplash) {
    return <Splash />
  }

  return (
    <div>
      <Head>
        <title>DEG EV Charging</title>
      </Head>
      <div className={`${styles.container} ${styles.minHeight}`}>
        <NextNProgress height={7} />
        <Header />
        {!geoLocationSearchPageVisible ? (
          <Box
            maxW={['unset', 'unset', 'unset', '70rem']}
            w="100%"
            margin="0 auto"
            className={`${styles.main} ${!isHomepage ? styles.withPadding : ''} ${
              !isHomepage && !isSearch ? styles.withMargin : ''
            } ${isSearch ? styles.searchMargin : ''} 
               ${isSignUp ? styles.withMarginSignUp : ''} 
              ${isSearchPage ? styles.searchPageMargin : ''}
              `}
          >
            {children}
            {bottomNavigatorWhiteList.includes(router.pathname) && <BottomNavigator />}
          </Box>
        ) : (
          <GeoLocationInputList />
        )}
      </div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        rtl={locale === 'en' ? false : true}
        position={locale === 'en' ? 'top-right' : 'top-left'}
      />
    </div>
  )
}

export default Layout
