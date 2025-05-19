import React, { useState } from 'react'
import Router from 'next/router'
import { Box } from '@chakra-ui/react'

import { useLanguage } from '../../hooks/useLanguage'
import beckenFooter from '../../public/images/beckenFooterLogo.svg'
import couresImageWhite from '../../public/images/landing-page-icons/CoursesWhite.svg'
import coursesImageBlack from '../../public/images/landing-page-icons/CoursesBlack.svg'
import jobsImageBlack from '../../public/images/landing-page-icons/jobsBlack.svg'
import jobsImageWhite from '../../public/images/landing-page-icons/jobsWhite.svg'
import scholarshipImageBlack from '../../public/images/landing-page-icons/scholarshipBlack.svg'
import scholarshipImageWhite from '../../public/images/landing-page-icons/scholarshipWhite.svg'
import { HomePageContent } from '@beckn-ui/common'

const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCard, setActiveCard] = useState<string | null>('course')

  const cardTypes = [
    { id: 1, type: 'course', images: { black: coursesImageBlack, white: couresImageWhite }, text: t.courseImgText },
    {
      id: 2,
      type: 'scholarship',
      images: { black: scholarshipImageBlack, white: scholarshipImageWhite },
      text: t.scholarshipImgText
    },
    { id: 3, type: 'jobs', images: { black: jobsImageBlack, white: jobsImageWhite }, text: t.jobsImgText }
  ]

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/search?searchTerm=${searchTerm}`)
  }
  const navigateToScholarship = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/scholarshipSearchPage?searchTerm=${searchTerm}`)
  }
  const navigateToJob = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/jobSearch?searchTerm=${searchTerm}`)
  }

  const handleClick = (type: string) => {
    setActiveCard(type)
  }

  const searchIconClickHandler = (e: any) => {
    if (searchTerm) {
      activeCard === 'course'
        ? navigateToSearchResults()
        : activeCard === 'jobs'
          ? navigateToJob()
          : navigateToScholarship()
    }
    e.preventDefault()
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
        CardSelector={{
          imageCardList: cardTypes.map(card => ({
            ...card,
            type: card.type as 'course' | 'scholarship' | 'jobs',
            image: card.images
          })),
          handleClick,
          activeCard: activeCard || ''
        }}
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
      />
    </Box>
  )
}

export default LandingPage
