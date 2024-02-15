import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import Header from '../header'
import store from '../../store/index'
import Footer from '../footer'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import NextNProgress from 'nextjs-progressbar'
import cs from 'classnames'
import GeoLocationInputList from '../geoLocationInput/GeoLocationInputList'
import { IGeoLocationSearchPageRootState } from '../../lib/types/geoLocationSearchPage'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
  const isHomepage = router.pathname === '/homePage'
  const isLandingPage = router.pathname === '/'
  const isSearchByLocation = router.pathname === '/searchByLocation'
  const isSearch = router.pathname === '/search'
  const paddingStyles = 'px-5 xl:px-16'
  const marginStyles = 'mt-[100px]'

  const geoLocationSearchPageVisible = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoLocationSearchPageVisible
  })

  return (
    <Provider store={store}>
      <ThemeProvider enableSystem={true}>
        <Head>
          <title>AgriLoop</title>
        </Head>
        <div
          className={cs(
            'flex flex-col ',
            { ['h-[100vh]']: isHomepage || isSearchByLocation },
            {
              ['min-h-[100vh]']: !isHomepage || !isSearchByLocation
            }
          )}
        >
          <NextNProgress height={7} />
          <Header />
          {!geoLocationSearchPageVisible ? (
            <main
              style={{
                maxHeight: isHomepage ? 'calc(100vh - 28px)' : 'calc(100vh - 102px)',
                overflowY: 'scroll'
              }}
              className={cs(
                'flex-grow',
                {
                  [paddingStyles]: !isHomepage && !isSearchByLocation
                },
                {
                  [marginStyles]: !isHomepage && !isSearch && !isSearchByLocation && !isLandingPage
                },
                {
                  ['mt-[24px]']: isHomepage || isSearchByLocation
                },
                { ['mt-[118px]']: isSearch },
                { ['mt-[30px]']: isLandingPage }
              )}
            >
              {children}
            </main>
          ) : (
            <GeoLocationInputList></GeoLocationInputList>
          )}
          {/* <Footer /> */}
        </div>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          rtl={locale === 'en' ? false : true}
          position={locale === 'en' ? 'top-right' : 'top-left'}
        />
      </ThemeProvider>
    </Provider>
  )
}

export default Layout
