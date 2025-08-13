import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../header'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import NextNProgress from 'nextjs-progressbar'
import styles from './Layout.module.css'
import { Box, useToast } from '@chakra-ui/react'
import { Toast } from '@beckn-ui/molecules/src/components'
import { IGeoLocationSearchPageRootState } from '@beckn-ui/common/lib/types'
import { feedbackActions, FeedbackRootState, ToastType } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { testIds } from '@shared/dataTestIds'
import { checkTokenExpiry, GeoLocationInputList, logout } from '@beckn-ui/common'
import Cookies from 'js-cookie'
import { RootState } from '@store/index'

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
  const { user } = useSelector((state: RootState) => state.auth)

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

  return (
    <div>
      <Head>
        <title>Harmoni Aids</title>
      </Head>
      <div className={`${styles.container} ${isHomepage ? styles.homepage : styles.minHeight}`}>
        <NextNProgress height={7} />
        <Header />
        {!geoLocationSearchPageVisible ? (
          <Box
            maxW={['unset', 'unset', 'unset', '70rem']}
            w="100%"
            margin="0 auto"
            overflowY={'scroll'}
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
  )
}

export default Layout
