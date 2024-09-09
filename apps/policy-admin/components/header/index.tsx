import React from 'react'
import {
  Avatar,
  Box,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Styles from './header.module.css'
import Constants from './constants'
import { useLanguage } from '@hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'
import { Typography } from '@beckn-ui/molecules'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState, logout } from '@store/auth-slice'
import { ChevronDownIcon } from '@chakra-ui/icons'
import logOutIcon from '@public/images/logOutIcon.svg'
import hamburgerIcon from '@public/images/hamburger.svg'

interface HeaderProps {
  handleDrawerToggle: () => void
}

const Header = (props: HeaderProps) => {
  const { handleDrawerToggle } = props
  const { headerNames, headerBlackList } = Constants
  const { isOpen, onClose, onOpen } = useDisclosure()

  const router = useRouter()
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()

  const { user } = useSelector((state: AuthRootState) => state.auth)

  return (
    <Box className={Styles.header}>
      {!headerBlackList.includes(router.pathname) && (
        <>
          <Box
            className={Styles.header_innr}
            padding={'0 0 0 1rem'}
          >
            <Image
              width={'16px'}
              cursor="pointer"
              className={Styles.sideNavIcon}
              src={hamburgerIcon}
              onClick={handleDrawerToggle}
            />
            <Box className={Styles.header_backIcon}>
              <Typography
                text={headerNames[router.pathname]}
                className={Styles.header_title_text}
                data-test={testIds.pageName}
                fontWeight="600"
                fontSize={'18px !important'}
              />
            </Box>
          </Box>
          <Box
            className={Styles.header_innr}
            padding={'0 1rem 0 0'}
          >
            <Avatar
              size="sm"
              backgroundColor={'#bdbdbd'}
              name={user?.username}
            />

            <Typography
              fontSize="14px"
              text={user?.username || ''}
            />

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<ChevronDownIcon />}
                variant="unstyled"
                aria-label="Options"
                p="0"
                minW="auto"
                display={'flex'}
                fontSize="22px"
              />
              <MenuList minW="50px">
                <MenuItem
                  gap={'0.5rem'}
                  onClick={() => dispatch(logout())}
                >
                  <Image
                    width={'16px'}
                    src={logOutIcon}
                  />
                  <Typography
                    fontSize="14px"
                    text={t.logoutIcon}
                  />
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Header
