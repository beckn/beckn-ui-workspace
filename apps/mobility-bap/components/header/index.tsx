import React, { useEffect, useState } from 'react'
import BottomModal from '../BottomModal'
import { Box, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useLanguage } from '../../hooks/useLanguage'

type PathnameObjectType = { [key: string]: string }

const storeHeaderBlackList: [] = []
const headerValues: PathnameObjectType = {}

const headerValuesFrench: PathnameObjectType = {}

const bottomHeaderBlackList = ['/homePage', '/orderConfirm']

const getHeaderTitleForPage = (name: string, logo: string, pathName: string, locale: string | undefined) => {
  const values = locale === 'en' ? headerValues : headerValuesFrench
  switch (true) {
    case storeHeaderBlackList.includes(pathName):
      return <Text>{values[pathName]}</Text>
    default:
      return (
        <Box
          width={'260px'}
          className="md:hidden ml-2  flex gap-1 my-2"
        >
          <Text
            margin={'0 auto'}
            textAlign={'center'}
            fontSize={'17px'}
            textOverflow={'ellipsis'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
          >
            {name}
          </Text>
        </Box>
      )
  }
}

export interface TopHeaderProps {
  handleMenuClick?: () => void
}

const BottomHeader = () => {
  const [optionTags, setOptionTags] = useState<any>()
  const { t, locale } = useLanguage()

  useEffect(() => {
    setOptionTags(JSON.parse(localStorage.getItem('optionTags') as string))
  }, [])

  const router = useRouter()

  return (
    <header className="md:fixed left-0 right-0 mb-4 top-0 md:bg-palette-fill shadow-sm pt-4 z-[1000] app_header_b fixed z-[99] bg-[#fff]">
      <div className="flex flex-col md:px-4">
        <div className="flex items-center justify-between md:order-2 md:mt-2 py-4  relative">
          <div className="flex gap-4 items-center"></div>
          <Image
            src="./images/travelbuddy_icon.svg"
            alt="travelbuddy_icon"
          />

          {getHeaderTitleForPage(optionTags?.name, optionTags?.logo, router.pathname, locale)}
        </div>
      </div>
    </header>
  )
}

const Header = () => {
  const router = useRouter()

  const renderBottomHeader = !bottomHeaderBlackList.includes(router.pathname)

  return <div>{renderBottomHeader && <BottomHeader />}</div>
}

export default Header
