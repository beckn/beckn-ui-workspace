import React from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'
import Constants from './constants'
import { testIds } from '@shared/dataTestIds'

const Header = () => {
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
      orderIconList
    }
  } = Constants

  const router = useRouter()
  const { t, locale } = useLanguage()

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {renderTopHeader && (
        <TopHeader
          appLogo="/images/headerLogo.svg"
          t={key => t[key]}
          headerConstants={{
            blackList: {
              appLogoBlackList,
              homeIconBlackList,
              languageIconWhiteList,
              menuIconWhiteList
            }
          }}
          menuItems={[
            {
              id: 'history',
              dataTest: testIds.orderHistory_text_click,
              label: 'Request History',
              href: '/orderHistory',
              icon: '/images/orderHistoryIcon.svg'
            },
            {
              id: 'logout',
              dataTest: testIds.Logout_text_click,
              label: 'Logout',
              href: '/signIn',
              icon: '/images/logOutIcon.svg',
              color: 'red'
            }
          ]}
        />
      )}
      {renderBottomHeader && (
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
              invoiceDownloadIconList: invoiceDownloadIcon
            }
          }}
        />
      )}
    </Box>
  )
}

export default Header
