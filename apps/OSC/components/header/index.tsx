import React, { useEffect, useState } from 'react'
import { BottomModal } from '@beckn-ui/molecules'

import { useTheme, Box, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react'
import styles from './header.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@store/auth-slice'

import { useLanguage } from '../../hooks/useLanguage'
import Qrcode from '@components/qrCode/Qrcode'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import CartIconWithCount from './CartIcon'
import Settings from './Settings'
import { ICartRootState } from '@lib/types'
import { useRouter } from 'next/router'

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
  '/cart',
  '/checkout',
  '/profile',
  '/orderCancellation',
  '/updateShippingDetails'
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
  '/signin'
]
const headerValues: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'My Orders',
  '/orderDetails': 'Order Details',
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
  '/search': 'Search results',
  '/checkout': 'Billing & Shipping'
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

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/searchByLocation']

const menuIconWhiteList = ['/', '/search', '/profile']
const orderIconList = ['/orderDetails']
const editIcon = ['/profile']
const invoiceDownloadIcon = ['']
const currentLocation = ['/']

const languageIconWhiteList = ['/', '/createProfile']

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
              src="/images/OSC_Icon.svg"
              alt="App logo"
            />
          </Box>
          <Flex columnGap={['10px', '10px', '2rem', '2rem']}>
            {languageIconWhiteList.includes(router.pathname) && <Settings />}
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
  const [isOrderModalOpen, setOrderModalOpen] = useState(false)
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const theme = useTheme()
  const storedHeaderText = getLocalStorage('selectCardHeaderText')

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

  // const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const router = useRouter()

  // useEffect(() => {
  //   // Check if geolocation is available in the browser
  //   if (navigator) {
  //     if ('geolocation' in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         async position => {
  //           const latitude = position.coords.latitude
  //           const longitude = position.coords.longitude

  //           const coordinates = {
  //             latitude,
  //             longitude
  //           }

  //           localStorage.setItem('coordinates', JSON.stringify(coordinates))

  //           try {
  //             const response = await fetch(
  //               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyForGoogle}`
  //             )

  //             if (response.ok) {
  //               const data = await response.json()

  //               if (data.results.length > 0) {
  //                 const formattedAddress = data.results[0].formatted_address
  //                 setCurrentAddress(formattedAddress)
  //               } else {
  //                 setFetchCurrentLocationError('No address found for the given coordinates.')
  //               }
  //             } else {
  //               setFetchCurrentLocationError('Failed to fetch address data.')
  //               alert('Failed to fetch address data.')
  //             }
  //           } catch (error) {
  //             setFetchCurrentLocationError('Error fetching address data: ' + (error as any).message)
  //             alert('Error fetching address data: ' + (error as any).message)
  //           } finally {
  //             setLoadingForCurrentAddress(false)
  //           }
  //         },
  //         error => {
  //           setFetchCurrentLocationError('Error getting location: ' + error.message)
  //           alert('Error getting location: ' + error.message)
  //           setLoadingForCurrentAddress(false)
  //         }
  //       )
  //     } else {
  //       setFetchCurrentLocationError('Geolocation is not available in this browser.')
  //       alert('Geolocation is not available in this browser.')
  //       setLoadingForCurrentAddress(false)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
            {/* {currentLocation.includes(router.pathname) && (
              <TopSheet
                currentLocationFetchError={currentLocationFetchError}
                loadingForCurrentAddress={loadingForCurrentAddress}
                currentAddress={currentAddress}
              />
            )} */}
          </Box>
          {getHeaderTitleForPage(
            // optionTags?.name,
            storedHeaderText as string,
            optionTags?.logo,
            router.pathname,
            locale
          )}
          <div className="flex gap-4">
            {!cartIconBlackList.includes(router.pathname) && (
              <CartIconWithCount
                itemCount={cartItems.length}
                handleClick={() => router.push('/cart')}
              />
            )}
          </div>
          {/* {editIcon.includes(router.pathname) && (
            <Image
              cursor="pointer"
              src="/images/editIcon.svg"
              alt="edit icon"
              mr={'20px'}
            />
          )} */}
          {orderIconList.includes(router.pathname) && (
            <Image
              cursor="pointer"
              onClick={() => setOrderModalOpen(true)}
              src="/images/downloadInvoice.svg"
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
        responsive={true}
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
      <BottomModal
        isOpen={isInvoiceModalOpen}
        onClose={handleInvoiceModalClose}
        responsive={true}
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
          <BecknButton children={t.proceed} />
        </Box>
      </BottomModal>
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
