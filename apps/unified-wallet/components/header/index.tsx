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

const Header = () => {
  const {
    TopHeader: { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList, topHeaderBlackList },
    SubHeader: {
      backIconList,
      bottomHeaderBlackList,
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

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)
  const profileSection = profileSectionIcon.includes(router.pathname)
    ? { src: profileIcon, handleClick: () => router.push('/profile') }
    : undefined
  console.log(router.query)
  const dynamicHeaderNames = {
    ...headerNames,
    '/physicalAssetsDetails': `${router.query.cred_name}`,
    '/attestationDetails': `${router.query.cred_name}`
  }

  return (
    <Box>
      {renderTopHeader && (
        <TopHeader
          appLogo={'/images/app_name.svg'}
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
              infoIconList: infoIconList
            }
          }}
          infoUrlLink={'https://en.wikipedia.org/wiki/Distributed_generation'}
        />
      )}
    </Box>
  )
}

export default Header
