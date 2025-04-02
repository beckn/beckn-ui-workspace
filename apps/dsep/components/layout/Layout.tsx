import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../header'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import NextNProgress from 'nextjs-progressbar'
import cs from 'classnames'
import { Toast } from '@beckn-ui/molecules'
import { ToastType } from '@beckn-ui/molecules/src/components/toast/Toast-type'
import { useToast } from '@chakra-ui/react'
import { feedbackActions, FeedbackRootState } from '../../store/ui-feedback-slice'
import { testIds } from '@shared/dataTestIds'
import { checkTokenExpiry } from '@beckn-ui/common'
import { logout } from '@beckn-ui/common'
import Cookies from 'js-cookie'
import { RootState } from '@store/index'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage()
  const router = useRouter()
  const isHomepage = router.pathname === '/'
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
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!['/signin', '/signUp', '/OTPVerification'].includes(router.pathname)) {
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
          style={{
            overflowY: 'scroll'
          }}
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
