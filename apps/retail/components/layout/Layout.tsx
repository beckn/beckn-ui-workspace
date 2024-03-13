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
    // <Provider store={store}>
    <ThemeProvider enableSystem={true}>
      <Head>
        <title>Kuza One</title>
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
    </ThemeProvider>
    // </Provider>
  )
}

export default Layout
