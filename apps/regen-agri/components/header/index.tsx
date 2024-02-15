import React, { useEffect, useState } from 'react'
import BottomModal from '../BottomModal'
import { Box, Image, Text } from '@chakra-ui/react'
import Settings from './Settings'
import CartIcon from '../cart/CartIcon'
import { useRouter } from 'next/router'

import { useLanguage } from '../../hooks/useLanguage'
import axios from 'axios'
import { StatusResponseModel } from '../../lib/types/order-details.types'
import LoaderWithMessage from '../loader/LoaderWithMessage'

const cartIconBlackList = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/',
  '/signUp',
  '/cart',
  '/checkoutPage',
  '/paymentMode',
  '/orderCancellation',
  '/searchByLocation'
]

const backIconList = ['/', '/orderDetails']

const homeIconBlackList = ['/orderHistory', '/', '/homePage', '/signUp']

const storeHeaderBlackList = [
  '/checkoutPage',
  '/orderHistory',
  '/orderDetails',
  '/cart',
  '/homePage',
  '/orderConfirmation',
  'feedback',
  '/paymentMode',
  '/signUp',
  '/search'
]
const headerValues = {
  '/checkoutPage': 'Billing & Shipping',
  '/orderHistory': 'Order History',
  '/orderDetails': 'Order Details',
  '/signUp': 'Sign Up',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/orderConfirmation': 'Order Confirmation',
  '/search': 'Search Result'
}

const headerValuesFrench = {
  '/checkoutPage': 'Facturation et Livraison',
  '/orderHistory': 'Historique des Commandes',
  '/orderDetails': 'Détails de la Commande',
  '/': 'Se Connecter',
  '/signUp': 'Sign Up',
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner la Méthode de Paiement',
  '/orderConfirmation': 'Confirmation de commande'
}

const topHeaderBlackList: string[] = []

const bottomHeaderBlackList = ['/homePage', '/orderCancellation', '/searchByLocation', '/feedback', '/']

const menuIconWhiteList = ['/homePage']

const languageIconWhiteList = ['/homePage', '/']
const helplineIcon = ['/orderDetails']

const getHeaderTitleForPage = (name: string, logo: string, pathName: string, locale: string | undefined) => {
  const values = locale === 'en' ? headerValues : headerValuesFrench
  switch (true) {
    case storeHeaderBlackList.includes(pathName):
      return <Text>{values[pathName]}</Text>
    default:
      return (
        <Box
          width={'260px'}
          className="md:hidden ml-2  flex gap-1 my-2"
        >
          <Text
            margin={'0 auto'}
            textAlign={'center'}
            fontSize={'17px'}
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
        <div className="px-5 h-full flex items-center">
          <div>
            <Image
              src="/images/GreenSpin.svg"
              alt="App logo"
            />
          </div>
          <div className="ml-auto flex gap-4">
            {/* {languageIconWhiteList.includes(router.pathname) && (
                            <Settings />
                        )} */}

            {/* {menuIconWhiteList.includes(router.pathname) && (
                            <Image
                                onClick={() => setMenuModalOpen(true)}
                                className="block"
                                src="/images/3-dots.svg"
                                alt="menu icon"
                            />
                        )} */}

            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                w={'88%'}
                onClick={() => {
                  // localStorage.clear();
                  // router.push("/");
                  let user = localStorage.getItem('userPhone') as string
                  localStorage.clear()
                  localStorage.setItem('userPhone', user)
                  router.push('/')
                }}
                src="/images/Home_icon.svg"
                alt="home Icon"
              />
            )}
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      <BottomModal
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
      >
        <div
          onClick={() => {
            router.push('/orderHistory')
          }}
          className="flex gap-2 py-5"
        >
          <Image
            src="/images/orderHistory.svg"
            alt="Order history icon"
          />
          {t['orderHistory']}
        </div>
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
  const [helplineModalOpen, setHelplineModalOpen] = useState(false)
  const [isLoadingForSupport, setIsLoadingForSupport] = useState(true)
  const [supporDetails, setSupportDetails] = useState({
    email: '',
    mobile: ''
  })
  const storedHeaderText = getLocalStorage('selectCardHeaderText')

  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
  }, [])

  const helplineModalClose = () => {
    setHelplineModalOpen(false)
  }
  const handleEmailCustomer = () => {
    const subject = 'Regarding Your Order'
    const body = 'Dear Customer,\n\n'

    const mailtoLink = `mailto:${supporDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`

    window.open(mailtoLink, '_blank')
  }
  const handleCallCustomer = () => {
    const telLink = `tel:${supporDetails.mobile}`
    window.open(telLink, '_blank')
  }

  const handleSupportIconClick = () => {
    setIsLoadingForSupport(true)
    setHelplineModalOpen(true)
    if (localStorage && localStorage.getItem('statusResponse')) {
      const parsedStatusResponse: StatusResponseModel[] = JSON.parse(localStorage.getItem('statusResponse') as string)

      const {
        context: { bpp_id, bpp_uri, transaction_id },
        message: {
          order: { id }
        }
      } = parsedStatusResponse[0]

      const supportPayload = {
        supportRequestDto: [
          {
            context: {
              bpp_id,
              bpp_uri,
              transaction_id,
              domain: 'retail'
            },
            message: {
              ref_id: id
            }
          }
        ]
      }

      axios
        .post(`${apiUrl}/client/v2/support`, supportPayload)
        .then(res => {
          const supportdata = res.data[0].message
          setSupportDetails({
            email: supportdata.email,
            mobile: supportdata.phone
          })
          setIsLoadingForSupport(false)
        })
        .catch(err => {
          console.error(err)
          setIsLoadingForSupport(false)
        })
    }
  }

  return (
    <>
      <header className="md:fixed left-0 right-0 mb-4 top-0 md:bg-palette-fill shadow-sm pt-4 z-[1000] app_header_b fixed mt-7 z-[99] bg-[#fff]">
        <div className="flex flex-col md:px-4">
          <div className="flex items-center justify-between md:order-2 md:mt-2 py-4  relative">
            <div className="flex gap-4 items-center">
              {!backIconList.includes(router.pathname) && (
                <div onClick={() => router.back()}>
                  <Image
                    src="/images/Back.svg"
                    alt="Back icon"
                  />
                </div>
              )}
            </div>

            {getHeaderTitleForPage(storedHeaderText as string, optionTags?.logo, router.pathname, locale)}
            <div className="flex gap-4">
              {!cartIconBlackList.includes(router.pathname) && <CartIcon />}
              {helplineIcon.includes(router.pathname) && (
                <Image
                  onClick={handleSupportIconClick}
                  src="/images/helpline_img.svg"
                  alt="helpline_img icon"
                />
              )}
            </div>
          </div>
        </div>
      </header>
      <BottomModal
        isOpen={helplineModalOpen}
        onClose={helplineModalClose}
      >
        {isLoadingForSupport ? (
          <LoaderWithMessage
            loadingText={t.supportLoaderText}
            loadingSubText={t.supportLoaderSubText}
          />
        ) : (
          <>
            <div
              onClick={handleCallCustomer}
              className="flex gap-2 py-4"
            >
              <Image
                src="/images/helpline_img.svg"
                alt="Call Customer Service"
              />
              {t['callCustomerService']}
            </div>
            <div
              onClick={handleEmailCustomer}
              className="flex gap-2 py-4"
            >
              <Image
                src="/images/emailCustomerService.svg"
                alt="Email Customer Service"
              />
              {t['emailCustomerService']}
            </div>
          </>
        )}
      </BottomModal>
    </>
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
