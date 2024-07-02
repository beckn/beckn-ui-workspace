import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { BottomModal } from '@beckn-ui/molecules'
import Styles from './topHeader.module.css'
import { logout } from '@beckn-ui/common/src/store/auth-slice'
import settingsIcon from '../../../public/images/threeDots.svg'
import { appLogoBlackList, homeIconBlackList, languageIconWhiteList, menuIconWhiteList } from './constants'
import { HeaderProps } from '../../../lib/types/components'
import Settings from '../settings/settings'
import { getLocalStorage, setLocalStorage } from '../../utils'

const Header: React.FC<HeaderProps> = ({ t }) => {
  const [isMenuModalOpen, setMenuModalOpen] = useState(false)
  const dispatch = useDispatch()

  const router = useRouter()

  const handleMenuModalClose = () => {
    setMenuModalOpen(false)
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
                src="/images/headerLogo.svg"
                alt="App logo"
              />
            )}
          </Box>
          <Flex columnGap={['10px', '10px', '2rem', '2rem']}>
            {languageIconWhiteList.includes(router.pathname) && <Settings t={t} />}
            {!homeIconBlackList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                w={'20px'}
                h={'20px'}
                onClick={() => {
                  const user = getLocalStorage('userPhone') as string
                  localStorage.clear()
                  setLocalStorage('userPhone', user)
                  router.push(`/`)
                }}
                src="/images/Home_icon.svg"
                alt="home Icon"
              />
            )}

            {menuIconWhiteList.includes(router.pathname) && (
              <Image
                cursor="pointer"
                onClick={() => setMenuModalOpen(true)}
                className="block"
                src={settingsIcon}
                alt="menu icon"
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
          <Box
            onClick={() => {
              router.push('/profile')
              setMenuModalOpen(false)
            }}
            className={Styles.top_header_modal}
          >
            <Image
              src="/images/userProfile.svg"
              alt="User profile"
            />
            {t('profileIcon')}
          </Box>
          <Box
            onClick={() => {
              router.push('/orderHistory')
              setMenuModalOpen(false)
            }}
            className={Styles.top_header_modal}
          >
            <Image
              src="/images/orderHistoryIcon.svg"
              alt="Order history icon"
            />
            {t('orderHistoryIcon')}
          </Box>
          <Box
            onClick={() => {
              dispatch(logout())
              router.push('/signIn')
              setMenuModalOpen(false)
            }}
            className={Styles.top_header_modal}
          >
            <Image
              src="/images/logOutIcon.svg"
              alt="Log out"
            />
            <span style={{ color: 'red' }}>{t('logoutIcon')}</span>
          </Box>
        </Flex>
      </BottomModal>
    </>
  )
}

export default Header
