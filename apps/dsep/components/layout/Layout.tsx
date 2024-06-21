import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import Header from '../header'
import Footer from '../footer'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import NextNProgress from 'nextjs-progressbar'
import cs from 'classnames'
import { PersistGate } from 'redux-persist/integration/react'
import { Toast } from '@beckn-ui/molecules'
import { ToastType } from '@beckn-ui/molecules/src/components/toast/Toast-type'
import { useToast } from '@chakra-ui/react'
import { feedbackActions, FeedbackRootState } from '../../store/ui-feedback-slice'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
  const isHomepage = router.pathname === '/homePage'
  const isSearch = router.pathname === '/search'
  const isFeedbackPage = router.pathname === '/feedback'
  const isOrderConfirmationPage = router.pathname === '/orderConfirmation'
  const paddingStyles = 'px-5 xl:px-16'
  const marginStyles = 'mt-[100px]'

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
    <>
      <Head>
        <title>Skill Seeker</title>
      </Head>
      <div
        className={cs(
          'flex flex-col ',
          {
            ['h-[100vh]']: isHomepage
          },
          {
            ['min-h-[100vh]']: !isHomepage
          }
        )}
      >
        <NextNProgress height={7} />
        <Header />
        <main
          className={cs(
            'flex-grow',
            {
              [paddingStyles]: !isHomepage
            },
            {
              [marginStyles]: !isHomepage && !isSearch && !isFeedbackPage && !isOrderConfirmationPage
            },
            {
              ['mt-[24px]']: isHomepage
            },
            {
              ['mt-[118px]']: isSearch
            }
          )}
        >
          {children}
        </main>
        {/* <Footer /> */}
      </div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        rtl={locale === 'en' ? false : true}
        position={locale === 'en' ? 'top-right' : 'top-left'}
      />
    </>
  )
}

export default Layout
