import React from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'
import Constants from './constants'
import { setProfileEditable } from '@store/user-slice'
import { useDispatch } from 'react-redux'

const Header = () => {
  const {
    TopHeader: { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList, topHeaderBlackList },
    SubHeader: { backIconList, bottomHeaderBlackList, headerBlackList, headerFrenchNames, headerNames, editIconList }
  } = Constants

  const router = useRouter()
  const { t, locale } = useLanguage()
  const dispatch = useDispatch()

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {renderTopHeader && (
        <TopHeader
          appLogo={'/images/OpenSparkTopLogo.svg'}
          t={key => t[key]}
          headerConstants={{
            blackList: {
              appLogoBlackList,
              homeIconBlackList,
              languageIconWhiteList,
              menuIconWhiteList
            }
          }}
          settingsMenu={false}
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
              backIconList: backIconList,
              editIconList: editIconList
            }
          }}
          handleClickOnEdit={() => {
            dispatch(setProfileEditable({ profileEditable: true }))
          }}
        />
      )}
    </Box>
  )
}

export default Header
