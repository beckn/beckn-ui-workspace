import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'
import Constants from './constants'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'

const Header = () => {
  const { t, locale } = useLanguage()
  const router = useRouter()

  const orderObjectUrl = useSelector(
    (state: { orderObjectUrl: { orderObjectUrl: string; isFlowCityOfParis: boolean } }) =>
      state.orderObjectUrl.orderObjectUrl
  )
  const selectionPageUrl = process.env.NEXT_PUBLIC_SELECTION_PAGE_URL
  const retailAppUrl = process.env.NEXT_PUBLIC_RETAIL_APP_URL

  const isFlowCityOfParis = useSelector(
    (state: { orderObjectUrl: { orderObjectUrl: string; isFlowCityOfParis: boolean } }) =>
      state.orderObjectUrl.isFlowCityOfParis
  )

  const {
    TopHeader: { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList, topHeaderBlackList },
    SubHeader: {
      backIconList,
      bottomHeaderBlackList,
      cartIconBlackList,
      headerBlackList,
      headerFrenchNames,
      headerNames,
      invoiceDownloadIcon,
      orderIconList,
      qrCodeScanerIcon
    }
  } = Constants

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {renderTopHeader && (
        <TopHeader
          appLogo="/images/appLogo.svg"
          t={key => t[key]}
          locale={locale!}
          headerConstants={{
            blackList: {
              appLogoBlackList,
              homeIconBlackList,
              languageIconWhiteList: !Cookies.get('tourismType') ? languageIconWhiteList : [],
              menuIconWhiteList
            }
          }}
          menuItems={[
            {
              id: 'logout',
              label: t.logout,
              href: `/signIn${Cookies.get('tourismType') ? `?tourismType=${Cookies.get('tourismType')}` : ''}`,
              icon: '/images/logOutIcon.svg',
              color: 'red'
            }
          ]}
        />
      )}
      {renderBottomHeader && (
        <>
          <SubHeader
            locale={locale!}
            t={key => t[key]}
            headerConstants={{
              headerNames: {
                defaultNames: headerNames,
                frenchNames: headerFrenchNames
              },
              blackList: {
                headerList: headerBlackList,
                backIconList: backIconList,
                orderIconList: orderIconList,
                cartIconList: cartIconBlackList,
                invoiceDownloadIconList: invoiceDownloadIcon,
                qrCodeScanerList: qrCodeScanerIcon
              }
            }}
            qrScanerValue={
              isFlowCityOfParis
                ? `${selectionPageUrl}??external_url=${orderObjectUrl}`
                : `${retailAppUrl}/??external_url=${orderObjectUrl}`
            }
            handleClick={() => {
              if (window && orderObjectUrl)
                window.location.href = isFlowCityOfParis
                  ? `${selectionPageUrl}?external_url=${orderObjectUrl}`
                  : `${retailAppUrl}/?&external_url=${orderObjectUrl}`
            }}
          />
        </>
      )}
    </Box>
  )
}

export default Header
