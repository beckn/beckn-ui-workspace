import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import { HomePageContent } from '@beckn-ui/common'

const HomePage = () => {
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const navigateToSearchResults = () => {
    if (searchTerm) {
      localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
      router.push(`/search?searchTerm=${searchTerm}`)
    }
  }

  const searchIconClickHandler = (e: React.MouseEvent) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }

  return (
    <>
      <HomePageContent
        blockOrder={['header', 'description', 'searchInput']}
        headerProps={{
          name: 'P2P Energy',
          title: '',
          description: t.subText
        }}
        searchProps={{
          searchPlaceholder: 'Search by energy units (kWh)',
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
      />
    </>
  )
}

export default HomePage
