import React, { useEffect, useState } from 'react'
import { BottomModal } from '@beckn-ui/molecules'

import { useTheme, Box, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { Router, useRouter } from 'next/router'
import styles from './header.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@store/auth-slice'

import { useLanguage } from '../../hooks/useLanguage'
import Qrcode from '@components/qrCode/Qrcode'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import CartIconWithCount from './CartIcon'
import TopSheet from '@components/topSheet/TopSheet'
import { ICartRootState } from '@lib/types'
import BottomModalScan from '@components/BottomModal/BottomModalScan'

type PathnameObjectType = { [key: string]: string }

const cartIconBlackList: string[] = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/signin',
  '/mobileOtp',
  '/checkoutPage',
  '/paymentMode',
  '/signUp',
  '/invoiceDetails',
  '/',
  '/cart'
]

const backIconList = ['/', '/signin']

const homeIconBlackList = ['/', '/signin', '/mobileOtp', '/paymentMode', '/signUp']

const storeHeaderBlackList = [
  '/checkoutPage',
  '/orderHistory',
  '/orderDetails',
  '/cart',
  '/',
  '/orderConfirmation',
  'feedback',
  '/',
  '/signUp',
  '/mobileOtp',
  '/paymentMode',
  '/invoiceDetails',
  '/assemblyDetails',
  '/updateShippingDetails',
  '/orderCancellation',
  '/profile',
  '/search',
  '/checkout',
  '/orderDetails'
]
const headerValues: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'My Orders',
  '/orderDetails': 'Billing Details',
  '/invoiceDetails': 'Invoice Details',
  '/signin': 'Sign In',
  '/signUp': 'Sign Up',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/assemblyDetails': 'Add Assembly Details',
  '/updateShippingDetails': 'Shipping Details',
  '/orderCancellation': 'Order Cancel',
  '/feedback': '',
  '/profile': 'Profile',
  '/search': 'Travel Packages',
  '/checkout': 'Checkout'
}

const headerValuesFrench: PathnameObjectType = {
  '/checkoutPage': 'Facturation et Livraison',
  '/orderHistory': 'Historique des Commandes',
  '/orderDetails': 'Détails de la Commande',
  '/': 'Se Connecter',
  '/mobileOtp': 'Se Connecter',
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner la Méthode de Paiement',
  '/feedback': ''
}

const topHeaderBlackList: string[] = []

const bottomHeaderBlackList = ['/orderConfirmation', '/']

const menuIconWhiteList = ['/', '/search', '/profile']
const orderIconList = ['/orderDetails']
const orderDetailsIcon = ['/orderDetails']
const currentLocation = ['/']

const getHeaderTitleForPage = (name: string, logo: string, pathName: string, locale: string | undefined) => {
  const values = locale === 'en' ? headerValues : headerValuesFrench
  switch (true) {
    case storeHeaderBlackList.includes(pathName):
      return <Text className={styles.header_title_text}>{values[pathName]}</Text>
    default:
      return (
        <Box className={styles.header_title}>
          <Text className={styles.header_title_text}>{name}</Text>
        </Box>
      )
  }
}

export interface TopHeaderProps {
  handleMenuClick?: () => void
}

const TopHeader: React.FC<TopHeaderProps> = ({ handleMenuClick }) => {
  const [isMenuModalOpen, setMenuModalOpen] = useState(false)
  const dispatch = useDispatch()

  const { t, locale } = useLanguage()
  const router = useRouter()

  const handleMenuModalClose = () => {
    setMenuModalOpen(false)
  }

  return (
    <>
      <Box
        className={styles.top_header}
        padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
      >
        <Box className={styles.top_header_wrapper}>
          <Box>
            <Image
              src={'/images/appLogo.svg'}
              alt="App logo"
            />
          </Box>
          <Flex columnGap={['10px', '10px', '2rem', '2rem']}>
            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                w={'20px'}
                h={'20px'}
                onClick={() => {
                  const user = localStorage.getItem('userPhone') as string
                  localStorage.clear()
                  localStorage.setItem('userPhone', user)
                  router.push(`/`)
                }}
                src="/images/Home_icon.svg"
                alt="home Icon"
              />
            )}
            {/* 
            {menuIconWhiteList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                onClick={() => setMenuModalOpen(true)}
                className="block"
                src="/images/threeDots.svg"
                alt="menu icon"
              />
            )} */}
          </Flex>
        </Box>
      </Box>

      {/* Menu Modal */}
      <BottomModal
        responsive={true}
        title=""
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
      >
        <Flex flexDirection="column">
          <Box
            onClick={() => {
              router.push('/profile')
              setMenuModalOpen(false)
            }}
            className={styles.top_header_modal}
          >
            <Image
              src="/images/userProfile.svg"
              alt="User profile"
            />
            {t['profileIcon']}
          </Box>
          <Box
            onClick={() => {
              router.push('/orderHistory')
              setMenuModalOpen(false)
            }}
            className={styles.top_header_modal}
          >
            <Image
              src="/images/orderHistoryIcon.svg"
              alt="Order history icon"
            />
            {t['orderHistoryIcon']}
          </Box>
          <Box
            onClick={() => {
              dispatch(logout())
              router.push('/signin')
              setMenuModalOpen(false)
            }}
            className={styles.top_header_modal}
          >
            <Image
              src="/images/logOutIcon.svg"
              alt="Log out"
            />
            <span style={{ color: 'red' }}>{t['logoutIcon']}</span>
          </Box>
        </Flex>
      </BottomModal>
    </>
  )
}
const getLocalStorage = (item: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(item)
  } else {
    return ''
  }
}

const BottomHeader = () => {
  const [optionTags, setOptionTags] = useState<any>()
  const { t, locale } = useLanguage()
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const storedHeaderText = getLocalStorage('selectCardHeaderText')

  const handleInvoiceModalClose = () => {
    setInvoiceModalOpen(false)
  }

  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
  }, [])

  const router = useRouter()

  return (
    <header className={styles.bottom_header}>
      <Box className={styles.bottom_header_wrapper}>
        <Box
          className={styles.bottom_header_innr}
          padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
        >
          <Box className={styles.bottom_header_backIcon}>
            {!backIconList.includes(router.pathname) && (
              <Box
                onClick={() => router.back()}
                cursor="pointer"
              >
                <Image
                  src="/images/Back.svg"
                  alt="Back icon"
                />
              </Box>
            )}
          </Box>
          {getHeaderTitleForPage(storedHeaderText as string, optionTags?.logo, router.pathname, locale)}

          {orderDetailsIcon.includes(router.pathname) && (
            <Image
              cursor="pointer"
              onClick={() => setInvoiceModalOpen(true)}
              src="/images/OrCodeModalOpen.svg"
              alt="invoice icon"
              mr={'20px'}
            />
          )}
        </Box>
      </Box>
      <BottomModalScan
        isOpen={isInvoiceModalOpen}
        onClose={handleInvoiceModalClose}
        modalHeader={'Scan QR'}
      >
        <Box p={'0px 24px'}>
          <Box
            textAlign={'center'}
            fontSize={'15px'}
          >
            <Text>{t.scanthisQR}</Text>
            <Text mb={'20px'}>{t.toImportthisorderanotherapp}</Text>
          </Box>

          <HStack
            alignItems={'center'}
            justifyContent={'center'}
            p={'20px'}
          >
            <Qrcode value={'https://odr-dev.becknprotocol.io/'} />
          </HStack>

          <Flex
            align="center"
            pt={'20px'}
            w={'70%'}
            margin={'0 auto'}
          >
            <Divider />
            <Text
              padding="2"
              fontSize={'12px'}
            >
              {t.or}
            </Text>
            <Divider />
          </Flex>
          <Text
            pb={'20px'}
            fontSize={'12px'}
            textAlign={'center'}
          >
            {t.clicktheShopbuttontobuyitemsforthistrip}
          </Text>
          <BecknButton children="Proceed" />

          <Flex
            pt={'20px'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Image
              pr={'20px'}
              src="/images/btmLogo1.png"
            />
            <Image
              pr={'20px'}
              src="/images/kochiLogo.png"
            />
            <Image src="/images/btmLogo3.png" />
          </Flex>
        </Box>
      </BottomModalScan>
    </header>
  )
}

const Header = () => {
  const router = useRouter()

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {renderTopHeader && <TopHeader />}
      {renderBottomHeader && <BottomHeader />}
    </Box>
  )
}

export default Header