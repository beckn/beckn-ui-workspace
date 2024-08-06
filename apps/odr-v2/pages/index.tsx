import React, { useEffect, useState, useRef } from 'react'
import { Box, useBreakpoint } from '@chakra-ui/react'

import { useRouter } from 'next/router'
import KuzaLogo from '@public/images/Kuza-mini.svg'
import AlternateLogo from '@public/images/KuzaLogo.svg'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'

import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'

const items = ['Civil Disputes', 'Financial Disputes', 'Family Disputes', 'Employment Disputes', 'Commercial Disputes']
const disputeCategoryMapper: any = {
  ['Civil Disputes']: 'civil-dispute',
  ['Family Disputes']: 'family-dispute',
  ['Employment Disputes']: 'employment-dispute',
  ['Commercial Disputes']: 'commercial-dispute',
  ['Financial Disputes']: 'financial-dispute'
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? KuzaLogo : AlternateLogo
  const { t } = useLanguage()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const router = useRouter()
  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    localStorage.setItem('optionTags1', JSON.stringify({ name: selectedItem }))
    const selectedCategory = selectedItem.trim().length ? disputeCategoryMapper[selectedItem] : ''
    router.push(`/search?searchTerm=${searchTerm}&selectedItem=${selectedCategory}`)
  }

  const searchIconClickHandler = (e: any) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const dropdownRef = useRef<any>(null)

  // const isButtonDisabled = !selectedItem && !searchTerm.trim()
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item: string) => {
    setSelectedItem(item)
    setIsOpen(false)
  }

  const handleOutsideClick = (e: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
      />
      <Box
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="calc(0rem + 90px)  auto"
        backgroundColor="white"
      >
        <HomePageContent
          blockOrder={['header', 'description', 'selectInput', 'searchInput']}
          headerProps={{
            name: 'LegalEase',
            description: t.homeText
          }}
          searchProps={{
            searchPlaceholder: t.searchPlaceholder,
            label: 'Service',
            setSearchTerm: setSearchTerm,
            onSearchIconClick: searchIconClickHandler,
            onSearchInputEnterPress: navigateToSearchResults
          }}
          selectInputProps={{
            items: items,
            selectedItem: selectedItem,
            isOpen: isOpen,
            toggleDropdown: toggleDropdown,
            handleItemClick: handleItemClick
          }}
          footerProps={{
            poweredByText: t.footerText,
            poweredByLogoSrc: beckenFooter
          }}
        />
      </Box>
    </>
  )
}

export default HomePage
