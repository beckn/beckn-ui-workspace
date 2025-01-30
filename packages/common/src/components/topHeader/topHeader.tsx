import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import Styles from './topHeader.module.css'
import { logout } from '@beckn-ui/common/src/store/auth-slice'
import settingsIcon from '../../../public/images/threeDots.svg'
import Settings from '../settings'
import { getLocalStorage, setLocalStorage } from '../../utils'
import { HeaderProps } from './topHeader.types'
import { testIds } from '@shared/dataTestIds'

const Header: React.FC<HeaderProps> = ({
  t,
  headerConstants,
  appLogo,
  locale,
  clearLocalStorageOnHomeIcon = true,
  menuItems = [
    {
      id: 'profile',
      dataTest: testIds.profile_text_click,
      label: t('profileIcon'),
      href: '/profile',
      icon: '/images/userProfile.svg'
    },
    {
      id: 'history',
      dataTest: testIds.orderHistory_text_click,
      label: t('orderHistoryIcon'),
      href: '/orderHistory',
      icon: '/images/orderHistoryIcon.svg'
    },
    {
      id: 'logout',
      dataTest: testIds.Logout_text_click,
      label: t('logoutIcon'),
      href: '/signIn',
      icon: '/images/logOutIcon.svg',
      color: 'red',
      handleOnClick: logout
    }
  ],
  settingsMenu = true,
  homePagePath = '/'
}) => {
  const {
    blackList: { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList }
  } = headerConstants

  const [isMenuModalOpen, setMenuModalOpen] = useState(false)
  const dispatch = useDispatch()

  const router = useRouter()

  const handleMenuModalClose = () => {
    setMenuModalOpen(false)
  }
  const handleLogout = () => {
    dispatch(logout())
    localStorage.clear()
    window.location.reload()
    router.push('/signIn')
  }

  return (
    <>
      <Box
        className={Styles.top_header}
        padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
      >
        <Box className={Styles.top_header_wrapper}>
          <Box>
            {!appLogoBlackList.includes(router.pathname) && (
              <Image
                src={appLogo}
                alt="App logo"
              />
            )}
          </Box>
          <Flex columnGap={['10px', '10px', '2rem', '2rem']}>
            {languageIconWhiteList.includes(router.pathname) && (
              <Settings
                t={t}
                locale={locale}
              />
            )}
            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                w={'20px'}
                h={'20px'}
                onClick={() => {
                  const user = getLocalStorage('userPhone') as string
                  if (clearLocalStorageOnHomeIcon) {
                    localStorage.clear()
                  }
                  setLocalStorage('userPhone', user)
                  router.push(homePagePath)
                }}
                src="/images/Home_icon.svg"
                alt="home Icon"
                data-test={testIds.home_icon}
              />
            )}

            {settingsMenu && menuIconWhiteList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                onClick={() => setMenuModalOpen(true)}
                className="block"
                src={settingsIcon}
                alt="menu icon"
                data-test={testIds.threeDots}
              />
            )}
          </Flex>
        </Box>
      </Box>

      {/* Menu Modal */}
      <BottomModal
        responsive={true}
        title=""
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
      >
        <Flex flexDirection="column">
          {menuItems.map((menuItem, index) => (
            <Box
              cursor={'pointer'}
              data-test={menuItem.dataTest}
              key={index}
              //   onClick={() => {
              //     if (menuItem.id === 'logout') {
              //       menuItem?.handleOnClick?.()
              //       dispatch(logout())
              //     }
              //     router.push(menuItem.href)
              //     setMenuModalOpen(false)
              //   }}
              //   className={Styles.top_header_modal}
              // >
              onClick={() => {
                if (menuItem.id === 'logout') {
                  handleLogout()
                } else {
                  router.push(menuItem.href)
                }
                setMenuModalOpen(false)
              }}
              className={Styles.top_header_modal}
            >
              <Image
                src={menuItem.icon}
                alt="User profile"
              />
              <Typography
                fontSize="16px"
                text={menuItem.label}
                color={menuItem?.color!}
              />
            </Box>
          ))}
        </Flex>
      </BottomModal>
    </>
  )
}

export default Header
