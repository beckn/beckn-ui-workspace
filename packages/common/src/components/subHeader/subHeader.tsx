import React, { useState } from 'react'
import { Box, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { BottomModal } from '@beckn-ui/molecules'
import Styles from './subHeader.module.css'
import {
  backIconList,
  cartIconBlackList,
  headerBlackList,
  headerFrenchNames,
  headerNames,
  invoiceDownloadIcon,
  orderIconList
} from './constants'
import { useRouter } from 'next/router'
import backIcon from '../../../public/images/Back.svg'
import { TranslationProps } from '../../../lib/types/components'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import CartIconWithCount from '../cartIconWithCount/cartIconWithCount'
import Qrcode from '../qrCode/Qrcode'
import { useSelector } from 'react-redux'
import { ICartRootState } from '../../../lib/types'
import { getLocalStorage } from '../../utils'

const getHeaderTitleForPage = (name: string, pathName: string, locale: string | undefined) => {
  const values = locale === 'en' ? headerNames : headerFrenchNames
  switch (true) {
    case headerBlackList.includes(pathName):
      return <Text className={Styles.header_title_text}>{values[pathName]}</Text>
    default:
      return (
        <Box className={Styles.header_title}>
          <Text className={Styles.header_title_text}>{name}</Text>
        </Box>
      )
  }
}

const SubHeader = (props: TranslationProps) => {
  const { locale, t } = props

  const [isOrderModalOpen, setOrderModalOpen] = useState(false)
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false)

  const router = useRouter()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const storedHeaderText = getLocalStorage('selectCardHeaderText')

  const handleInvoiceModalClose = () => {
    setInvoiceModalOpen(false)
  }
  const handleOrderModalClose = () => {
    setOrderModalOpen(false)
  }

  return (
    <header className={Styles.bottom_header}>
      <Box className={Styles.bottom_header_wrapper}>
        <Box
          className={Styles.bottom_header_innr}
          padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
        >
          <Box className={Styles.bottom_header_backIcon}>
            {!backIconList.includes(router.pathname) && (
              <Box
                onClick={() => router.back()}
                cursor="pointer"
              >
                <Image
                  src={backIcon}
                  alt="Back icon"
                />
              </Box>
            )}
          </Box>
          {getHeaderTitleForPage(storedHeaderText, router.pathname, locale)}
          <div className="flex gap-4">
            {!cartIconBlackList.includes(router.pathname) && (
              <CartIconWithCount
                itemCount={cartItems.length}
                handleClick={() => router.push('/cart')}
              />
            )}
          </div>
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
          className={Styles.top_header_modal}
        >
          <Image
            src="/images/invoiceDetails.svg"
            alt="invoice Details icon"
          />
          {t('invoiceDetails')}
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
            <Text>{t('scanthisQR')}</Text>
            <Text mb={'20px'}>{t('toImportthisorderanotherapp')}</Text>
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
              {t('or')}
            </Text>
            <Divider />
          </Flex>
          <Text
            pb={'20px'}
            fontSize={'12px'}
            textAlign={'center'}
          >
            {t('clicktheShopbuttontobuyitemsforthistrip')}
          </Text>
          <BecknButton children="Proceed" />
        </Box>
      </BottomModal>
    </header>
  )
}

export default SubHeader