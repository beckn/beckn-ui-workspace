import React from 'react'
import { Box, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useLanguage } from '@hooks/useLanguage'
import { SubHeader } from '@beckn-ui/common'
import Constants from './constants'

const Header = () => {
  const {
    SubHeader: { backIconList, bottomHeaderBlackList, headerBlackList, headerFrenchNames, headerNames }
  } = Constants

  const router = useRouter()
  const { t, locale } = useLanguage()

  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return (
    <Box>
      {!renderBottomHeader && (
        <header className="md:fixed left-0 right-0 mb-4 top-0 md:bg-palette-fill shadow-sm pt-4 z-[1000] app_header_b fixed z-[99] bg-[#fff]">
          <div className="flex flex-col md:px-4">
            <div className="flex items-center md:order-2 md:mt-2 py-4  relative">
              <div className="flex gap-4 items-center"></div>
              <Image
                src="./images/travelbuddy_icon.svg"
                alt="travelbuddy_icon"
              />
            </div>
          </div>
        </header>
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
