import React, { useEffect, useState } from 'react'
import BottomModal from '../BottomModal'
import { Box, Image, Text, Flex } from '@chakra-ui/react'
import CartIcon from '../cart/CartIcon'
import { useRouter } from 'next/router'

import { useLanguage } from '../../hooks/useLanguage'

const cartIconBlackList = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/',
  '/mobileOtp',
  '/cart',
  '/checkoutPage',
  '/paymentMode'
]

const backIconList = ['/', '/orderDetails']

const homeIconBlackList = ['/orderHistory', '/', '/homePage', '/checkoutPage', '/paymentMode', '/orderConfirmation']

const storeHeaderBlackList = [
  '/checkoutPage',
  '/orderHistory',
  '/orderDetails',
  '/cart',
  '/orderConfirmation',
  '/feedback',
  '/',
  '/mobileOtp',
  '/paymentMode'
]
const headerValues = {
  '/checkoutPage': 'Billing & Shipping',
  '/orderHistory': 'Order History',
  '/orderDetails': 'Order Details',
  '/': 'Sign In',
  '/mobileOtp': 'Sign In',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/feedback': 'Review & Rate the Product'
}

const headerValuesFrench = {
  '/checkoutPage': 'Facturation et Livraison',
  '/orderHistory': 'Historique des Commandes',
  '/orderDetails': 'Détails de la Commande',
  '/': 'Se Connecter',
  '/mobileOtp': 'Se Connecter',
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner la Méthode de Paiement',
  feedback: "Retour d'Information"
}

const topHeaderBlackList: string[] = []

const bottomHeaderBlackList = ['/homePage', '/orderConfirmation']

const menuIconWhiteList = ['/homePage', '/search', '/product']

const languageIconWhiteList = ['/mobileOtp']

const getHeaderTitleForPage = (name: string, logo: string, pathName: string, locale: string | undefined) => {
  const values = locale === 'en' ? headerValues : headerValuesFrench

  switch (true) {
    case storeHeaderBlackList.includes(pathName):
      return <Text fontWeight={600}>{values[pathName]}</Text>
    default:
      return (
        <Box width={'260px'} className="flex gap-1 my-2 ml-2 md:hidden">
          <Text
            margin={'0 auto'}
            textAlign={'center'}
            fontSize={'17px'}
            textOverflow={'ellipsis'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
          >
            {/* {name} */}
          </Text>
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
      {/* TODO :- enable this after language change and order history implementation */}
      <div className="h-7 w-full bg-[#efefef] fixed z-[9999]">
        <div className="flex items-center h-full px-5">
          <div className="flex gap-4 ml-auto">
            {languageIconWhiteList.includes(router.pathname) && (
              <Image src="/images/BottomModalIcon.svg" alt="BottomModalIcon icon" />
            )}
            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                w={'88%'}
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
                src="/images/3-dots.svg"
                alt="menu icon"
              />
            )}
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      <BottomModal isOpen={isMenuModalOpen} onClose={handleMenuModalClose}>
        <Flex
          pb={'20px'}
          ml={'20px'}
          gap={4}
          onClick={() => {
            router.push(`/orderHistory`)
            setMenuModalOpen(false)
          }}
        >
          <Image src="/images/orderHistory.svg" alt="Order history icon" />
          {t('orderHistory')}
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
  const storedHeaderText = getLocalStorage('selectCardHeaderText')

  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
  }, [])

  const router = useRouter()

  return (
    <header className="md:fixed left-0 right-0 mb-4 top-0 md:bg-palette-fill shadow-sm pt-4 z-[1000] app_header_b fixed mt-7 z-[99] bg-[#fff]">
      <div className="flex flex-col md:px-4">
        <div className="relative flex items-center justify-between py-4 md:order-2 md:mt-2">
          <div className="flex items-center gap-4">
            {!backIconList.includes(router.pathname) && (
              <div onClick={() => router.back()}>
                <Image src="/images/Back.svg" alt="Back icon" />
              </div>
            )}
          </div>

          {getHeaderTitleForPage(
            storedHeaderText as string,
            optionTags?.name,
            // optionTags?.logo,
            router.pathname,
            locale
          )}
          <div className="flex gap-4">{!cartIconBlackList.includes(router.pathname) && <CartIcon />}</div>
        </div>
      </div>
    </header>
  )
}

const Header = () => {
  const router = useRouter()

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <div>
      {renderTopHeader && <TopHeader />}
      {renderBottomHeader && <BottomHeader />}
    </div>
  )
}

export default Header
