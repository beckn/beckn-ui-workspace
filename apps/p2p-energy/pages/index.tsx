import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import { HomePageContent } from '@beckn-ui/common'
import ClickableImage from '@components/ClickableImage'
import { Box, Flex } from '@chakra-ui/react'

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
          name: 'Beckn Grid Connect',
          title: '',
          description: t.subText
        }}
        searchProps={{
          searchPlaceholder: 'Search by energy units (kWh)',
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        // customComponent={
        //   <Flex
        //     justifyContent={'center'}
        //     width="100%"
        //     bottom="8rem"
        //     left="0"
        //     mt="5rem"
        //     mb="1rem"
        //   >
        //     <ClickableImage
        //       url="https://wa.me/916364334426"
        //       imageUrl="https://t4.ftcdn.net/jpg/01/80/16/47/360_F_180164769_QwHw3kthiG3SxwJphPRwghggJTx8nut3.jpg"
        //     />
        //   </Flex>
        // }
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
      />
    </>
  )
}

export default HomePage
