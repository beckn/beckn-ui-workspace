import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../header'
import { ToastContainer } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Layout.module.css'
import NextNProgress from 'nextjs-progressbar'
import { Box, useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { feedbackActions, FeedbackRootState, ToastType } from '@beckn-ui/common'
import { Toast } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'
import CustomDrawer from '@components/customDrawer/customDrawer'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const { locale } = useLanguage()
  const router = useRouter()
  const isHome = router.pathname === '/'
  const signIn = router.pathname === '/signIn'
  const isSignUp = router.pathname === '/signUp'
  const isSearch = router.pathname === '/search'
  const isResetPassword = router.pathname === '/resetPassword'

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
            dataTest={testIds.feedback}
          />
        )
      })
      dispatch(feedbackActions.toggleToast({ display: false }))
    }
  }, [display])

  const renderContent = () => {
    return (
      <Box className={`${styles.container} ${styles.minHeight}`}>
        <NextNProgress height={7} />
        <Header handleDrawerToggle={() => setIsOpen(!isOpen)} />
        <Box
          maxW={['unset', 'unset', 'unset', 'unset']}
          w="100%"
          margin="0 auto"
          className={`${styles.main} ${styles.withPadding} ${
            !isSearch ? styles.withMargin : ''
          } ${isSearch ? styles.searchMargin : ''} 
         ${isSignUp ? styles.withMarginSignUp : ''} 
        ${isSearch ? styles.searchPageMargin : ''}
        `}
        >
          {children}
        </Box>
      </Box>
    )
  }

  return (
    <div>
      <Head>
        <title>Network Policy</title>
      </Head>
      {!signIn && !isSignUp && !isResetPassword ? (
        <CustomDrawer
          isOpen={isOpen}
          handleDrawerToggle={() => setIsOpen(!isOpen)}
        >
          {renderContent()}
        </CustomDrawer>
      ) : (
        renderContent()
      )}
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
