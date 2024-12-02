import React from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'
import Constants from './constants'
import { useSelector } from 'react-redux'
import { RiderRootState } from '@store/rider-slice'
import { useToggleAvailabilityMutation } from '@services/RiderService'

const Header = () => {
  const {
    TopHeader: { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList, topHeaderBlackList },
    SubHeader: { backIconList, bottomHeaderBlackList, headerBlackList, headerFrenchNames, headerNames }
  } = Constants

  const [toggleAvailability] = useToggleAvailabilityMutation()
  const router = useRouter()
  const { t, locale } = useLanguage()
  const { currentLocation } = useSelector((state: RiderRootState) => state.rider)

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
          menuItems={[
            {
              id: 'profile',
              label: t.profileIcon,
              href: '/profile',
              icon: '/images/userProfile.svg'
            },
            {
              id: 'history',
              label: t.rideHistoryIcon,
              href: '/myRides',
              icon: '/images/orderHistoryIcon.svg'
            },
            {
              id: 'logout',
              label: t.logoutIcon,
              href: '/signIn',
              icon: '/images/logOutIcon.svg',
              color: 'red',
              handleOnClick: async () => {
                try {
                  const requestBody = {
                    available: false,
                    location: {
                      lat: currentLocation.geoLocation?.latitude.toString(),
                      long: currentLocation.geoLocation?.longitude.toString()
                    }
                  }

                  await toggleAvailability(requestBody).unwrap()
                } catch (err: any) {
                  console.error(`Error toggling availability while logout: ${err?.message}`)
                }
              }
            }
          ]}
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
