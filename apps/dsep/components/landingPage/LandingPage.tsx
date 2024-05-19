import React, { useState } from 'react'
import Router from 'next/router'
import { SearchInput } from '@beckn-ui/becknified-components'
import { Box, Flex, Text, Image } from '@chakra-ui/react'

import ImageCard from './ImageCard'
import { useLanguage } from '../../hooks/useLanguage'
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
  const [activeCard, setActiveCard] = useState<string | null>('course')

  const cardTypes = ['course', 'scholarship', 'jobs']

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/search?searchTerm=${searchTerm}`)
  }

  const handleClick = (type: string) => {
    setActiveCard(type)
  }

  const searchIconClickHandler = (e: any) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }

  return (
    <Box p={'20px'}>
      <Text
        fontSize={'40px'}
        fontWeight="800"
        color={'rgba(var(--color-primary))'}
        pt="30px"
        lineHeight={'40px'}
      >
        {t.homeHeading}
      </Text>
      <Text
        fontSize={'27px'}
        fontWeight="800"
        pb={'15px'}
      >
        {t.headingSpan}
      </Text>
      <Text fontSize={'15px'}>{t.homeText}</Text>
      <Flex
        justifyContent={'space-between'}
        alignItems="center"
        pt={'25px'}
      >
        {cardTypes.map(type => (
          <ImageCard
            key={type}
            image={
              activeCard === type
                ? type === 'course'
                  ? couresImageWhite
                  : type === 'scholarship'
                    ? scholarshipImageWhite
                    : jobsImageWhite
                : type === 'course'
                  ? coursesImageBlack
                  : type === 'scholarship'
                    ? scholarshipImageBlack
                    : jobsImageBlack
            }
            text={type === 'course' ? t.courseImgText : type === 'scholarship' ? t.scholarshipImgText : t.jobsImgText}
            onClick={() => handleClick(type)}
            isActive={activeCard === type}
          />
        ))}
      </Flex>

      <Box pt={'25px'}>
        <SearchInput
          name="search_input"
          onChangeHandler={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
          searchIcon={'/images/searchIcon.svg'}
          searchIconClickHandler={searchIconClickHandler}
          onEnterHandler={(e: { key: string }) => e.key === 'Enter' && navigateToSearchResults()}
          placeHolder={`Search for ${activeCard}`}
        />
      </Box>
      <Flex
        justifyContent={'center'}
        alignItems="center"
        width=" calc(100% - 40px)"
        position={'fixed'}
        bottom="15px"
      >
        <Text
          pr={'8px'}
          fontSize="10px"
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
  )
}

export default LandingPage
