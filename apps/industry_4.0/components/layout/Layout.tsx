import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../header'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import NextNProgress from 'nextjs-progressbar'
import styles from './Layout.module.css'
import { IGeoLocationSearchPageRootState } from '@lib/types/geoLocationSearchPage'
import GeoLocationInputList from '@components/geoLocationInput/GeoLocationInputList'
import { FeedbackRootState, feedbackActions, ToastType } from '@store/ui-feedback-slice'
import { Toast } from '@beckn-ui/molecules/src/components'
import { useToast } from '@chakra-ui/react'

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
    <div>
      <Head>
        <title>Suppliflow</title>
      </Head>
      <div className={`${styles.container} ${isHomepage ? styles.homepage : styles.minHeight}`}>
        <NextNProgress height={7} />
        <Header />
        {!geoLocationSearchPageVisible ? (
          <main
            className={`${styles.main} ${!isHomepage ? styles.withPadding : ''} ${
              !isHomepage && !isSearch ? styles.withMargin : ''
            } ${isHomepage ? styles.homepageMargin : isSearch ? styles.searchMargin : ''} 
               ${isSignUp ? styles.withMarginSignUp : ''} 
              ${isSearchPage ? styles.searchPageMargin : ''}
              `}
          >
            {children}
          </main>
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
