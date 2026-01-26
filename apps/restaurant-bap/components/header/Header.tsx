import React from 'react'
import { Box, Flex, Text, IconButton, Badge, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi'
import { useLanguage } from '@hooks/useLanguage'
import { RootState } from '@store/index'
import { useDispatch } from 'react-redux'
import { logout } from '@beckn-ui/common/src/store/auth-slice'
import Cookies from 'js-cookie'
import { isUserLoggedIn, getMockUser, clearMockUserSession } from '../../constants/auth'
import LocationSelector from '../location/LocationSelector'

const Header: React.FC = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { totalQuantity } = useSelector((state: RootState) => state.cart)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const user = getMockUser()
  const isLoggedIn = isAuthenticated || isUserLoggedIn()

  const handleLogout = () => {
    try {
      // Clear auth state
      localStorage.clear()
      dispatch(logout())
      Cookies.remove('authToken')
      // Clear mock user session
      clearMockUserSession()
      // Redirect to sign in
      router.push('/signIn')
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: just clear storage and redirect
      Cookies.remove('authToken')
      localStorage.clear()
      clearMockUserSession()
      router.push('/signIn')
    }
  }

  const shouldShowHeader = !['/signIn', '/signUp'].includes(router.pathname)

  if (!shouldShowHeader) return null

  return (
    <Box
      bg="white"
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={['16px', '24px']}
        py="12px"
        alignItems="center"
        justifyContent="space-between"
        gap="16px"
      >
        {/* Left Section: Logo + Location */}
        <Flex
          align="start"
          flexDir={'column'}
          // gap={{ base: '12px', md: '24px' }}
          flex="1"
          minW="0"
        >
          <Text
            fontSize={{ base: '18px', md: '24px' }}
            fontWeight="700"
            color="#FF6B35"
            cursor="pointer"
            onClick={() => router.push('/')}
            flexShrink={0}
          >
            QuickBites
          </Text>

          {/* Location Selector - Always visible */}
          <Box
            flex="1"
            maxW={{ base: '200px', sm: '250px', md: '300px' }}
          >
            <LocationSelector />
          </Box>
        </Flex>

        <Flex
          alignItems="center"
          gap={['8px', '16px']}
        >
          <Box
            position="relative"
            cursor="pointer"
            onClick={() => router.push('/cart')}
          >
            <IconButton
              aria-label="Cart"
              icon={<FiShoppingCart />}
              variant="ghost"
              size={'lg'}
              w="48px"
              h="48px"
              fontSize="24px"
              mb="0"
            />
            {totalQuantity > 0 && (
              <Badge
                position="absolute"
                top="-2px"
                right="-2px"
                bg="#FF6B35"
                color="white"
                borderRadius="full"
                fontSize="10px"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="600"
              >
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </Badge>
            )}
          </Box>

          {isLoggedIn ? (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Profile Menu"
                mb="0"
                icon={
                  <Avatar
                    size="sm"
                    name={user?.name || 'User'}
                    bg="#FF6B35"
                    color="white"
                  />
                }
                variant="ghost"
                borderRadius="full"
                size={['sm', 'md']}
              />
              <MenuList>
                <MenuItem
                  icon={<FiUser />}
                  onClick={() => router.push('/profile')}
                >
                  My Profile
                </MenuItem>
                <MenuItem
                  icon={<FiPackage />}
                  onClick={() => router.push('/orderHistory')}
                >
                  My Orders
                </MenuItem>
                <MenuItem
                  icon={<FiLogOut />}
                  onClick={handleLogout}
                  color="red.500"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Text
              fontSize={['12px', '14px']}
              fontWeight="600"
              color="#FF6B35"
              cursor="pointer"
              onClick={() => router.push('/signIn')}
            >
              Sign In
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header
