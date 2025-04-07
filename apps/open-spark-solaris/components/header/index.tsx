import React from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'
import Constants from './constants'
import { setProfileEditable, UserRootState } from '@store/user-slice'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'
import { ROLE } from '@lib/config'
import profileIcon from '@public/images/user_profile.svg'
import { RootState } from '@store/index'

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
      editIconList,
      profileSectionIcon,
      infoIconList
    }
  } = Constants

  const router = useRouter()
  const { t, locale } = useLanguage()
  const dispatch = useDispatch()
  const { profileEditable } = useSelector((state: UserRootState) => state.user)

  const pathType = useSelector((state: RootState) => state.navigation.type)
  const showCartIcon = pathType !== 'RENT_AND_HIRE'

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)
  const profileSection = profileSectionIcon.includes(router.pathname)
    ? { src: profileIcon, handleClick: () => router.push('/profile') }
    : undefined
  const { role } = useSelector((state: AuthRootState) => state.auth)
  const dynamicHeaderNames = {
    ...headerNames,
    '/tradeDetails': role === ROLE.CONSUMER ? 'No. of Units Bought' : 'No. of Units Sold',
    '/buyingPreference': `${Object.keys(router.query).length > 0 ? 'Edit' : ''} ${headerNames['/buyingPreference']}`,
    '/sellingPreference': `${Object.keys(router.query).length > 0 ? 'Edit' : ''} ${headerNames['/sellingPreference']}`
  }

  return (
    <Box>
      {renderTopHeader && (
        <TopHeader
          appLogo={'/images/Solaris.svg'}
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
          showCartIcon={showCartIcon}
          profileSection={profileSection}
          headerConstants={{
            headerNames: {
              defaultNames: dynamicHeaderNames,
              frenchNames: headerFrenchNames
            },
            blackList: {
              headerList: headerBlackList,
              backIconList: backIconList,
              editIconList: editIconList,
              infoIconList: infoIconList,
              cartIconList: cartIconBlackList
            }
          }}
          handleClickOnEdit={() => {
            dispatch(setProfileEditable({ profileEditable: true }))
          }}
          infoUrlLink={'https://en.wikipedia.org/wiki/Distributed_generation'}
        />
      )}
    </Box>
  )
}

export default Header
