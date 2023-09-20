import React from 'react'

import Image from 'next/image'
import Router from 'next/router'
import { useState } from 'react'

import ImageCard from './ImageCard'
import { useLanguage } from '../../hooks/useLanguage'
import Styles from './LandingPage.module.css'

import { FaSearch } from 'react-icons/fa'
import { Box, Flex, Text } from '@chakra-ui/react'

import beckenFooter from '../../public/images/beckenFooterLogo.svg'
import couresImageWhite from '../../public/images/landing-page-icons/CoursesWhite.svg'
import coursesImageBlack from '../../public/images/landing-page-icons/CoursesBlack.svg'

import jobsImageBlack from '../../public/images/landing-page-icons/jobsBlack.svg'
import jobsImageWhite from '../../public/images/landing-page-icons/jobsWhite.svg'
import scholarshipImageBlack from '../../public/images/landing-page-icons/scholarshipBlack.svg'
import scholarshipImageWhite from '../../public/images/landing-page-icons/scholarshipWhite.svg'

const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocussed, setIsFocussed] = useState({ course: false, scholarship: false, jobs: false })

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/search?searchTerm=${searchTerm}`)
  }
  const handleClick = (type: string) => {
    setIsFocussed({ ...{ course: false, scholarship: false, jobs: false }, [type]: true })
  }
  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.flex_container}>
        <Box className={Styles.heading}>{t.homeHeading}</Box>
        <Box className={Styles.span_text}>{t.headingSpan}</Box>
        <Box className={Styles.para_Text}>
          <Text>{t.homeText}</Text>
        </Box>
        <Flex>
          <ImageCard
            image={isFocussed.course ? couresImageWhite : coursesImageBlack}
            className={isFocussed.course ? Styles.textWhite : ''}
            text={t.courseImgText}
            onClick={() => handleClick('course')}
          />
          <ImageCard
            image={isFocussed.scholarship ? scholarshipImageWhite : scholarshipImageBlack}
            text={t.scholarshipImgText}
            className={isFocussed.scholarship ? Styles.textWhite : ''}
            onClick={() => handleClick('scholarship')}
          />
          <ImageCard
            image={isFocussed.jobs ? jobsImageWhite : jobsImageBlack}
            className={isFocussed.jobs ? Styles.textWhite : ''}
            text={t.jobsImgText}
            onClick={() => handleClick('jobs')}
          />
        </Flex>
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
