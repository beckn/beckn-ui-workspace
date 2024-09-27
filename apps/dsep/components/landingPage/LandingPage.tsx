import React, { useState } from 'react'
import Router from 'next/router'
import { Box, Flex } from '@chakra-ui/react'

import { useLanguage } from '../../hooks/useLanguage'
import beckenFooter from '../../public/images/beckenFooterLogo.svg'
import couresImageWhite from '../../public/images/landing-page-icons/CoursesWhite.svg'
import coursesImageBlack from '../../public/images/landing-page-icons/CoursesBlack.svg'
import jobsImageBlack from '../../public/images/landing-page-icons/jobsBlack.svg'
import jobsImageWhite from '../../public/images/landing-page-icons/jobsWhite.svg'
import scholarshipImageBlack from '../../public/images/landing-page-icons/scholarshipBlack.svg'
import scholarshipImageWhite from '../../public/images/landing-page-icons/scholarshipWhite.svg'
import { HomePageContent } from '@beckn-ui/common'
import ImageCard from './ImageCard'

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

  const CardSelector = () => {
    return (
      <>
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
      </>
    )
  }

  return (
    <Box
      p={'20px'}
      mt={'-50px'}
    >
      <HomePageContent
        blockOrder={['header', 'description', 'cardType', 'searchInput']}
        headerProps={{
          name: t.homeHeading,
          title: t.headingSpan,
          description: t.homeText
        }}
        searchProps={{
          searchPlaceholder: `Search for ${activeCard}`,
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        CardSelector={
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
            pt={'25px'}
            mb={'20px'}
          >
            <CardSelector />
          </Flex>
        }
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
      />
    </Box>
  )
}

export default LandingPage
