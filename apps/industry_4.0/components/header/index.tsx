import React, { useEffect, useState } from 'react'
import { BottomModal } from '@beckn-ui/molecules'

import { Box, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import styles from './header.module.css'

import { useLanguage } from '../../hooks/useLanguage'
import Qrcode from '@components/qrCode/Qrcode'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

type PathnameObjectType = { [key: string]: string }

const cartIconBlackList: string[] = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/',
  '/mobileOtp',
  '/cart',
  '/checkoutPage',
  '/paymentMode',
  '/search',
  '/product',
  '/signUp',
  '/invoiceDetails'
]

const backIconList = ['/']

const homeIconBlackList = ['/', '/homePage', '/mobileOtp', '/paymentMode', '/signUp']

const storeHeaderBlackList = [
  '/checkoutPage',
  '/orderHistory',
  '/orderDetails',
  '/cart',
  '/homePage',
  '/orderConfirmation',
  'feedback',
  '/',
  '/signUp',
  '/mobileOtp',
  '/paymentMode',
  '/invoiceDetails',
  '/assemblyDetails',
  '/updateShippingDetails',
  '/orderCancellation'
]
const headerValues: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'Order History',
  '/orderDetails': 'Order Details',
  '/invoiceDetails': 'Invoice Details',
  '/': 'Sign In',
  '/signUp': 'Sign Up',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/assemblyDetails': 'Add Assembly Details',
  '/updateShippingDetails': 'Shipping Details',
  '/orderCancellation': 'Order Cancel',
  '/feedback': ''
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

const bottomHeaderBlackList = ['/homePage', '/search', '/orderConfirmation']

const menuIconWhiteList = ['/homePage']
const orderIconList = ['/orderDetails']
const invoiceDownloadIcon = ['/invoiceDetails']

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

  const { t, locale } = useLanguage()
  const router = useRouter()

  const handleMenuModalClose = () => {
    setMenuModalOpen(false)
  }

  return (
    <>
      <Box className={styles.top_header}>
        <Box className={styles.top_header_wrapper}>
          <Box>
            <Image
              src="/images/Suppliflow_app_logo.svg"
              alt="App logo"
            />
          </Box>
          <Flex columnGap={'10px'}>
            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                w={'20px'}
                h={'20px'}
                onClick={() => {
                  const user = localStorage.getItem('userPhone') as string
                  localStorage.clear()
                  localStorage.setItem('userPhone', user)
                  router.push(`/homePage`)
                }}
                src="/images/Home_icon.svg"
                alt="home Icon"
              />
            )}

            {menuIconWhiteList.includes(router.pathname) && (
              <Image
                onClick={() => setMenuModalOpen(true)}
                className="block"
                src="/images/threeDots.svg"
                alt="menu icon"
              />
            )}
          </Flex>
        </Box>
      </Box>

      {/* Menu Modal */}
      <BottomModal
        title=""
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
      >
        <Box
          onClick={() => {
            router.push('/orderHistory')
            setMenuModalOpen(false)
          }}
          className={styles.top_header_modal}
        >
          <Image
            src="/images/orderHistory.svg"
            alt="Order history icon"
          />
          {t['orderHistory']}
        </Box>
      </BottomModal>
    </>
  )
}

const BottomHeader = () => {
  const [optionTags, setOptionTags] = useState<any>()
  const { t, locale } = useLanguage()
  const [isOrderModalOpen, setOrderModalOpen] = useState(false)
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const handleInvoiceModalClose = () => {
    setInvoiceModalOpen(false)
  }
  const handleOrderModalClose = () => {
    setOrderModalOpen(false)
  }
  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
  }, [])

  const router = useRouter()

  return (
    <header className={styles.bottom_header}>
      <Box className={styles.bottom_header_wrapper}>
        <Box className={styles.bottom_header_innr}>
          <Box className={styles.bottom_header_backIcon}>
            {!backIconList.includes(router.pathname) && (
              <Box onClick={() => router.back()}>
                <Image
                  src="/images/Back.svg"
                  alt="Back icon"
                />
              </Box>
            )}
          </Box>
          {getHeaderTitleForPage(optionTags?.name, optionTags?.logo, router.pathname, locale)}
          {orderIconList.includes(router.pathname) && (
            <Image
              onClick={() => setOrderModalOpen(true)}
              src="/images/orderDetailsIcon.svg"
              alt="order icon"
              mr={'20px'}
            />
          )}
          {invoiceDownloadIcon.includes(router.pathname) && (
            <Image
              onClick={() => setInvoiceModalOpen(true)}
              src="/images/downloadInvoice.svg"
              alt="invoice icon"
              mr={'20px'}
            />
          )}
        </Box>
      </Box>
      <BottomModal
        title=""
        isOpen={isOrderModalOpen}
        onClose={handleOrderModalClose}
      >
        <Box
          onClick={() => {
            router.push('/invoiceDetails')
            setOrderModalOpen(false)
          }}
          className={styles.top_header_modal}
        >
          <Image
            src="/images/invoiceDetails.svg"
            alt="invoice Details icon"
          />
          {t['invoiceDetails']}
        </Box>
      </BottomModal>
      <BottomModalScan
        isOpen={isInvoiceModalOpen}
        onClose={handleInvoiceModalClose}
        modalHeader={t.scanQR}
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
