import React from 'react'
import { Box, Flex, Text, IconButton, Badge } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi'
import { useLanguage } from '@hooks/useLanguage'
import { RootState } from '@store/index'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { useDispatch } from 'react-redux'
import { authActions } from '@beckn-ui/common/src/store/auth-slice'
import Cookies from 'js-cookie'

const Header: React.FC = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { totalQuantity } = useSelector((state: RootState) => state.cart)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const handleLogout = () => {
    dispatch(authActions.logout())
    Cookies.remove('authToken')
    router.push('/signIn')
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
        py="16px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontSize="24px"
          fontWeight="700"
          color="#FF6B35"
          cursor="pointer"
          onClick={() => router.push('/')}
        >
          FoodDelivery
        </Text>

        <Flex
          alignItems="center"
          gap="16px"
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
            />
            {totalQuantity > 0 && (
              <Badge
                position="absolute"
                top="-4px"
                right="-4px"
                bg="#FF6B35"
                color="white"
                borderRadius="full"
                fontSize="10px"
                minW="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {totalQuantity}
              </Badge>
            )}
          </Box>

          {isAuthenticated ? (
            <>
              <IconButton
                aria-label="Profile"
                icon={<FiUser />}
                variant="ghost"
                onClick={() => router.push('/profile')}
              />
              <IconButton
                aria-label="Logout"
                icon={<FiLogOut />}
                variant="ghost"
                onClick={handleLogout}
              />
            </>
          ) : (
            <Text
              fontSize="14px"
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
