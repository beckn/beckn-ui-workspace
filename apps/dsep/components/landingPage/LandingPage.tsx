import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import Styles from './LandingPage.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import beckenFooter from '../../public/images/beckenFooterLogo.svg'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import Router from 'next/router'
import { useState } from 'react'
import { Search } from '@beckn-ui/common'

const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/search?searchTerm=${searchTerm}`)
  }
  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.flex_container}>
        <Box className={Styles.heading}>{t.homeHeading}</Box>
        <Box className={Styles.span_text}>{t.headingSpan}</Box>
        <Box className={Styles.para_Text}>
          <Text>{t.homeText}</Text>
        </Box>
        <Search
          handleOnChange={value => setSearchTerm(value)}
          handlePressEnter={() => navigateToSearchResults()}
          handleOnSearchClick={() => {
            if (searchTerm) navigateToSearchResults()
          }}
        />
        <Flex className={Styles.footer_container}>
          <Text className={Styles.footerText}>{t.footerText}</Text>
          <Image src={beckenFooter} alt="footerLogo" width={39} height={13} />
        </Flex>
      </Flex>
    </Box>
  )
}

export default LandingPage
