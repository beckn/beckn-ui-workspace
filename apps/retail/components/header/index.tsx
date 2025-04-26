import React, { useEffect, useState } from 'react'
import { BottomModal } from '@beckn-ui/molecules'

import { Box, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import styles from './header.module.css'

import { useLanguage } from '../../hooks/useLanguage'
import Qrcode from '@components/qrCode/Qrcode'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import TopSheet from '@components/topSheet/TopSheet'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@utils/logout'

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

const backIconList = ['/', '/homePage']

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
  '/orderCancellation',
  '/profile'
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
  '/feedback': '',
  '/profile': 'Profile'
  // '/search':'Search results'
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

const bottomHeaderBlackList = ['/orderConfirmation']

const menuIconWhiteList = ['/homePage', '/search', '/profile']
const orderIconList = ['/orderDetails']
const invoiceDownloadIcon = ['/invoiceDetails']
const currentLocation = ['/homePage']

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
      <Box
        className={styles.top_header}
        padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
      >
        <Box className={styles.top_header_wrapper}>
          <Box>
            {/* <Image
              src="/images/Suppliflow_app_logo.svg"
              alt="App logo"
            /> */}
          </Box>
          <Flex columnGap={['10px', '10px', '2rem', '2rem']}>
            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                w={'20px'}
                h={'20px'}
                onClick={() => {
                  const dispatch = useDispatch()
                  logoutUser(dispatch, router)
                  router.push(`/homePage`)
                }}
                src="/images/Home_icon.svg"
                alt="home Icon"
              />
            )}

            {menuIconWhiteList.includes(router.pathname) && (
              <Image
                cursor="pointer"
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
        <Box
          onClick={() => {
            const dispatch = useDispatch()
            logoutUser(dispatch, router)
            setMenuModalOpen(false)
          }}
          className={styles.top_header_modal}
        >
          <Image
            src="/images/logout.svg"
            alt="Logout icon"
          />
          Logout
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

  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [currentLocationFetchError, setFetchCurrentLocationError] = useState('')
  const handleInvoiceModalClose = () => {
    setInvoiceModalOpen(false)
  }
  const handleOrderModalClose = () => {
    setOrderModalOpen(false)
  }
  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
  }, [])

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const router = useRouter()

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            const coordinates = {
              latitude,
              longitude
            }

            localStorage.setItem('coordinates', JSON.stringify(coordinates))

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyForGoogle}`
              )

              if (response.ok) {
                const data = await response.json()

                if (data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address
                  setCurrentAddress(formattedAddress)
                } else {
                  setFetchCurrentLocationError('No address found for the given coordinates.')
                }
              } else {
                setFetchCurrentLocationError('Failed to fetch address data.')
                alert('Failed to fetch address data.')
              }
            } catch (error) {
              setFetchCurrentLocationError('Error fetching address data: ' + (error as any).message)
              alert('Error fetching address data: ' + (error as any).message)
            } finally {
              setLoadingForCurrentAddress(false)
            }
          },
          error => {
            setFetchCurrentLocationError('Error getting location: ' + error.message)
            alert('Error getting location: ' + error.message)
            setLoadingForCurrentAddress(false)
          }
        )
      } else {
        setFetchCurrentLocationError('Geolocation is not available in this browser.')
        alert('Geolocation is not available in this browser.')
        setLoadingForCurrentAddress(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            {currentLocation.includes(router.pathname) && (
              <TopSheet
                currentLocationFetchError={currentLocationFetchError}
                loadingForCurrentAddress={loadingForCurrentAddress}
                currentAddress={currentAddress}
              />
            )}
          </Box>
          {getHeaderTitleForPage(optionTags?.name, optionTags?.logo, router.pathname, locale)}
          <div className="flex gap-4">
            {!cartIconBlackList.includes(router.pathname) && (
              <Box
                onClick={() => router.push('/cart')}
                cursor="pointer"
              >
                <Image
                  src="/images/cartIcon.svg"
                  alt="Cart icon"
                />
              </Box>
            )}
          </div>
          {orderIconList.includes(router.pathname) && (
            <Image
              cursor="pointer"
              onClick={() => setOrderModalOpen(true)}
              src="/images/orderDetailsIcon.svg"
              alt="order icon"
              mr={'20px'}
            />
          )}
          {invoiceDownloadIcon.includes(router.pathname) && (
            <Image
              cursor="pointer"
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
