import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import Styles from './LandingPage.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import beckenFooter from '../../public/images/beckenFooterLogo.svg'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import Router from 'next/router'
import { useState } from 'react'

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
        <Box className={Styles.input_group}>
          <input
            className={Styles.input_box}
            type="text"
            name="search_input"
            placeholder="Search for courses"
            onChange={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
            onKeyDown={event => event.key === 'Enter' && navigateToSearchResults()}
          />
          <button className={Styles.search_button}>
            <FaSearch
              onClick={e => {
                if (searchTerm) {
                  navigateToSearchResults()
                }
                e.preventDefault()
              }}
            />
          </button>
        </Box>
        <Flex className={Styles.footer_container}>
          <Text className={Styles.footerText}>{t.footerText}</Text>
          <Image src={beckenFooter} alt="footerLogo" width={39} height={13} />
        </Flex>
      </Flex>
    </Box>
  )
}

export default LandingPage
