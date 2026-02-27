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
import backArrow from '@public/images/location-back.svg'
import { HEADER_CONFIG } from '@lib/config'
import {
  checkoutBeckn20Actions,
  checkTokenExpiry,
  clearSource,
  feedbackActions,
  FeedbackRootState,
  GeoLocationInputList,
  ToastType
} from '@beckn-ui/common'
import { Toast } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'
import Splash from '../splash/splash'
import Cookies from 'js-cookie'
import { AuthRootState } from '@store/auth-slice'
import BottomNavigator from '@components/BottomNavigator/BottomNavigator'
import TopHeader from '@components/TopHeader/TopHeader'

const bottomNavigatorWhiteList = ['/', '/discovery', '/cart', '/orderHistory', '/profile']

const evLayoutRoutes = [
  '/',
  '/discovery',
  '/detailView',
  '/cart',
  '/checkout',
  '/paymentMode',
  '/orderConfirmation',
  '/orderHistory',
  '/profile',
  '/signIn',
  '/signUp'
]

const headerTitleByRoute: Record<string, string> = {
  '/': 'EV Hub',
  '/discovery': 'Discover Page',
  '/detailView': 'Details View',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/paymentMode': 'Payment',
  '/orderConfirmation': 'Order Confirmation',
  '/orderHistory': 'Chargers',
  '/profile': 'Profile',
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up'
}

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
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
    // Exclude home, discovery, detailView, checkout, paymentMode and auth pages from token check (avoid clearing checkout state on payment flow)
    if (
      ![
        '/',
        '/signIn',
        '/signUp',
        '/OTPVerification',
        '/discovery',
        '/detailView',
        '/checkout',
        '/paymentMode'
      ].includes(router.pathname)
    ) {
      const token = Cookies.get('authToken')
      let message = ''

      try {
        const isExpired = checkTokenExpiry(token) as boolean
        if (isExpired || !user) message = 'Token expired, please log in again!'
      } catch (error) {
        console.error('Token decoding error:', error)
        message = 'Token decode failed, please log in again!'
      } finally {
        if (message) {
          // Don't show alert or redirect for discovery page - just clear state silently
          dispatch(clearSource())
          dispatch(checkoutBeckn20Actions.clearState())
          // Don't call logout() as it redirects - just clear cookies
          Cookies.remove('authToken')
          Cookies.remove('isVerified')
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

  // For EV app routes: common TopHeader + content + BottomNavigator from Layout
  if (evLayoutRoutes.includes(router.pathname)) {
    const showBottomNav = bottomNavigatorWhiteList.includes(router.pathname)
    const isAuthPage = router.pathname === '/signIn' || router.pathname === '/signUp'
    const title = headerTitleByRoute[router.pathname] ?? 'EV Charging'
    const showBack = router.pathname !== '/' && !isAuthPage
    return (
      <div
        className={`ev-app ${showBottomNav ? 'ev-with-bottom-nav' : ''}`}
        style={
          showBottomNav
            ? { height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
            : isAuthPage
              ? { minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--ev-bg)' }
              : undefined
        }
      >
        <NextNProgress height={7} />
        <TopHeader
          title={title}
          showBack={showBack}
          centerTitle={isAuthPage}
          appName={HEADER_CONFIG.appName}
          showHomeButton={
            ['/', '/paymentMode', '/checkout', '/orderConfirmation'].includes(router.pathname)
              ? false
              : HEADER_CONFIG.showHomeButton
          }
          useTwoRowHeader={HEADER_CONFIG.useTwoRowHeader && !isAuthPage}
          showTitleRow={!(HEADER_CONFIG.hideTitleOnRoutes ?? []).includes(router.pathname)}
        />
        <div
          style={
            showBottomNav
              ? {
                  flex: 1,
                  minHeight: 0,
                  minWidth: 0,
                  width: '100%',
                  overflow: 'auto',
                  overflowX: 'hidden',
                  paddingBottom: 'calc(var(--ev-bottom-nav-h) + var(--ev-safe-bottom) + 16px)',
                  background: 'var(--ev-bg)'
                }
              : isAuthPage
                ? {
                    flex: 1,
                    minHeight: 'calc(100dvh - var(--ev-header-h))',
                    background: 'var(--ev-bg)',
                    width: '100%',
                    minWidth: 0
                  }
                : { width: '100%', minWidth: 0, background: 'var(--ev-bg)' }
          }
        >
          {children}
        </div>
        {showBottomNav && <BottomNavigator />}
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          rtl={locale === 'en' ? false : true}
          position={locale === 'en' ? 'top-right' : 'top-left'}
        />
      </div>
    )
  }

  const showBottomNav = bottomNavigatorWhiteList.includes(router.pathname)

  return (
    <div className={`ev-app ${showBottomNav ? 'ev-with-bottom-nav' : ''}`}>
      <Head>
        <title>DEG EV Charging</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
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
            style={
              showBottomNav
                ? { paddingBottom: 'calc(var(--ev-bottom-nav-h) + var(--ev-safe-bottom) + 16px)' }
                : undefined
            }
          >
            {children}
            {showBottomNav && <BottomNavigator />}
          </Box>
        ) : (
          <GeoLocationInputList backIcon={backArrow} />
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
