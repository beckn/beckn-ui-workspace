import React from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { TopHeader, SubHeader } from '@beckn-ui/common'

const topHeaderBlackList: string[] = []
const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback']

const Header = () => {
  const router = useRouter()
  const { t, locale } = useLanguage()

  const renderTopHeader = !topHeaderBlackList.includes(router.pathname)
  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {renderTopHeader && <TopHeader t={key => t[key]} />}
      {renderBottomHeader && (
        <SubHeader
          locale={locale!}
          t={key => t[key]}
        />
      )}
    </Box>
  )
}

export default Header
