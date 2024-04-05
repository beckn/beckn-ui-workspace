/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Flex, Image, Text, useBreakpoint } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import KuzaLogo from '@public/images/Kuza-mini.svg'
import AlternateLogo from '@public/images/KuzaLogo.svg'
import TopSheet from '@components/topSheet/TopSheet'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import SearchInput from '@beckn-ui/becknified-components/src/components/search-input'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? KuzaLogo : AlternateLogo
  const { t } = useLanguage()

  const router = useRouter()

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    router.push(`/search?searchTerm=${searchTerm}`)
  }

  const searchIconClickHandler = (e: any) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }

  return (
    <>
      <Box
        p={'0 20px'}
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="4rem auto"
        backgroundColor="white"
      >
        <Image
          src={currentLogo}
          alt={'Kuza One'}
          pt="15px"
          pb="15px"
          m={{ base: '0', xl: '0 auto' }}
        />
        <SearchInput
          onChangeHandler={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
          searchIcon={'/images/search.svg'}
          searchIconClickHandler={searchIconClickHandler}
          onEnterHandler={(e: { key: string }) => e.key === 'Enter' && navigateToSearchResults()}
          placeHolder="Search for Products"
        />

        <Flex
          justifyContent={'center'}
          alignItems="center"
          width=" calc(100% - 40px)"
          position={'fixed'}
          bottom="15px"
        >
          <Text
            pr={'8px'}
            fontSize="12px"
            color={'#000000'}
          >
            {t.footerText}
          </Text>
          <Image
            src={beckenFooter}
            alt="footerLogo"
            width={39}
            height={13}
          />
        </Flex>
      </Box>
    </>
  )
}

export default HomePage
