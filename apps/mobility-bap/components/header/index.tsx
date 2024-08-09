import React from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'
import Constants from './constants'

const Header = () => {
  const {
    TopHeader: { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList, topHeaderBlackList },
    SubHeader: { backIconList, bottomHeaderBlackList, headerBlackList, headerFrenchNames, headerNames }
  } = Constants

  const router = useRouter()
  const { t, locale } = useLanguage()

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {renderTopHeader && (
        <TopHeader
          appLogo={'/images/mobility-logo.svg'}
          t={key => t[key]}
          headerConstants={{
            blackList: {
              appLogoBlackList,
              homeIconBlackList,
              languageIconWhiteList,
              menuIconWhiteList
            }
          }}
        />
      )}
      {renderBottomHeader && (
        <SubHeader
          locale={locale!}
          t={key => t[key]}
          showCartIcon={false}
          headerConstants={{
            headerNames: {
              defaultNames: headerNames,
              frenchNames: headerFrenchNames
            },
            blackList: {
              headerList: headerBlackList,
              backIconList: backIconList
            }
          }}
        />
      )}
    </Box>
  )
}

export default Header
