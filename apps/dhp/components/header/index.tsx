import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import BottomModal from '../BottomModal'
import { Box, Image, Text } from '@chakra-ui/react'
import Settings from './Settings'
import CartIcon from '../cart/CartIcon'
import { useRouter } from 'next/router'

import { useLanguage } from '../../hooks/useLanguage'

const cartIconBlackList = [
  '/orderConfirmation',
  '/checkoutForLab',
  '/doctorPaymentMode',
  '/labPaymentMode',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/',
  '/mobileOtp',
  '/cart',
  '/checkoutPage',
  '/paymentMode',
  '/createProfile',
  '/myAppointments',
  '/orderDetailsHistoryPage',
  '/PrescriptionPage',
  '/checkoutForMedicine',
  '/orderConfirmationForMedicine',
  '/bookDoctorAppointment',
  '/search',
  '/product',
  '/searchLabs',
  '/labDetails',
  '/bookLabAppointment'
]

const backIconList = ['/', '/orderDetails']

const homeIconBlackList = ['/orderHistory', '/', '/homePage', '/mobileOtp', '/createProfile', '/search']

const storeHeaderBlackList = [
  '/checkoutPage',
  '/orderHistory',
  '/orderDetails',
  '/cart',
  '/homePage',
  '/orderConfirmation',
  'feedback',
  '/',
  '/paymentMode',

  '/createProfile',
  '/myAppointments',
  '/orderDetailsHistoryPage',
  '/PrescriptionPage',
  '/searchMedicine',
  '/checkoutForMedicine',
  '/bookDoctorAppointment',
  '/search',
  '/searchLabs',
  '/bookLabAppointment',
  '/checkoutForLab',
  '/doctorPaymentMode',
  '/labPaymentMode'
]
const headerValues = {
  '/checkoutPage': 'Checkout',
  '/orderHistory': 'Order History',
  '/orderDetails': 'Order Details',
  '/': 'Sign In',
  '/mobileOtp': 'Sign In',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/jobSearch': 'Jobs',
  feedback: 'Feedback',
  '/jobDetails': 'Jobs',
  '/jobApply': 'Senior UX Analyst',
  '/createProfile': 'Create Profile',
  '/myAppointments': 'My Appointments',
  '/orderDetailsHistoryPage': 'Order Details',
  '/PrescriptionPage': 'Prescription',
  '/searchMedicine': 'Medicines',
  '/checkoutForMedicine': 'Billing & Shipping',
  '/bookDoctorAppointment': 'Book Appointment',
  '/search': 'Search Results',
  '/searchLabs': 'Labs',
  '/bookLabAppointment': 'Book Appointment',
  '/checkoutForLab': 'Checkout',
  '/doctorPaymentMode': 'Payment',
  '/labPaymentMode': 'Payment'
}

const headerValuesFrench = {
  '/checkoutPage': 'Facturation et Livraison',
  '/orderHistory': 'Historique des Commandes',
  '/orderDetails': 'Détails de la Commande',
  '/': 'Se Connecter',
  '/mobileOtp': 'Se Connecter',
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner la Méthode de Paiement',
  '/createProfile': 'Profile',
  feedback: "Retour d'Information"
}

const topHeaderBlackList: string[] = []

const bottomHeaderBlackList = [
  '/homePage',
  '/orderConfirmation',
  '/orderConfirmationForMedicine',
  '/orderConfirmationForLab'
]

const menuIconWhiteList = [
  '/homePage',
  '/search',
  '/product',
  '/checkoutPage',
  '/doctorPaymentMode',
  '/orderConfirmation',
  '/checkoutForLab',
  '/labPaymentMode'
]

const languageIconWhiteList = ['/', '/createProfile']

const getHeaderTitleForPage = (name: string, logo: string, pathName: string, locale: string | undefined) => {
  const values = locale === 'en' ? headerValues : headerValuesFrench
  switch (true) {
    case storeHeaderBlackList.includes(pathName):
      return <Text>{values[pathName]}</Text>
    default:
      return (
        <Box width={'260px'} className="flex gap-1 ml-2 md:hidden">
          <Text
            margin={'0 auto'}
            textAlign={'center'}
            textOverflow={'ellipsis'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
          >
            {name}
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
      <div className="h-7 w-full bg-[#efefef] fixed z-[9999]">
        <div className="flex items-center h-full px-5">
          <div>
            <Image src="/images/genHeal.svg" alt="App logo" />
          </div>
          <div className="flex gap-4 ml-auto">
            {languageIconWhiteList.includes(router.pathname) && <Settings />}

            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                w={'20px'}
                onClick={() => {
                  // localStorage.clear();
                  // router.push("/");
                  let user = localStorage.getItem('userPhone') as string
                  localStorage.clear()
                  localStorage.setItem('userPhone', user)
                  router.push('/homePage')
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
        <div
          onClick={() => {
            router.push('/orderHistory')
          }}
          className="flex gap-2 py-4 text-[15px]"
        >
          <Image src="/images/orderHistoryIcon.svg" alt="orderHistory icon" />
          {t['orderHistory']}
        </div>
        <div
          onClick={() => {
            router.push('/myAppointments')
          }}
          className="flex gap-2 py-4 text-[15px]"
        >
          <Image src="/images/myAppointmentsIcon.svg" alt="myAppointments icon" />
          {t['myAppointments']}
        </div>
      </BottomModal>
    </>
  )
}

const BottomHeader = () => {
  const [optionTags, setOptionTags] = useState<any>()
  const { t, locale } = useLanguage()

  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
    window.addEventListener('storage-optiontags', () => {
      setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
    })
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

          {getHeaderTitleForPage(optionTags?.name, optionTags?.logo, router.pathname, locale)}
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
