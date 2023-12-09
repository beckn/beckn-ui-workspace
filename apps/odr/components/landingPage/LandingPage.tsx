import React, { useEffect, useRef, useState } from 'react'
import { Flex, Text, Input, Image, Box, Icon, Divider } from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import Router from 'next/router'
import { useLanguage } from '../../hooks/useLanguage'
import beckenFooter from '../../public/images/beckenFooterLogo.svg'

const items = ['Civil Disputes', 'Financial Disputes', 'Family Disputes', 'Employment Disputes', 'Commercial Disputes']
const disputeCategoryMapper: any = {
  ['Civil Disputes']: 'civil-dispute',
  ['Family Disputes']: 'family-dispute',
  ['Employment Disputes']: 'employment-dispute',
  ['Commercial Disputes']: 'commercial-dispute'
}

const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const dropdownRef = useRef<any>(null)

  const isButtonDisabled = !selectedItem || !searchTerm.trim()
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
  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    localStorage.setItem('optionTags1', JSON.stringify({ name: selectedItem }))
    const selectedCategory = selectedItem.trim().length ? disputeCategoryMapper[selectedItem] : ''
    Router.push(`/search?searchTerm=${searchTerm}&selectedItem=${selectedCategory}`)
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
        fontSize={'15px'}
        mt={'15px'}
        fontFamily="Poppins"
      >
        {t.homeText}{' '}
      </Text>

      <Flex
        flexDir={'column'}
        mt={'25px'}
        rowGap={'5px'}
      >
        <Text
          fontSize={'15px'}
          fontWeight={600}
          color={'#183831'}
        >
          {t.category}
        </Text>
        <Box
          position="relative"
          display="inline-block"
        >
          <Box
            padding="12px"
            cursor="pointer"
            border="1px solid #ccc"
            borderRadius={'5px'}
            onClick={toggleDropdown}
            fontSize={'15px'}
            fontWeight={400}
            backgroundColor={'transparent'}
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            color={'#747474'}
          >
            {selectedItem || 'Select Category'}

            <Icon
              as={isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown}
              ml="2"
              w={'20px'}
              h={'20px'}
            />
          </Box>
          {isOpen && (
            <Box
              display="block"
              position="absolute"
              backgroundColor="#fff"
              boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
              zIndex="1"
              width={'100%'}
              borderRadius={'5px'}
            >
              {items.map((item, index) => (
                <Box
                  key={index}
                  className="dropdown-item"
                  cursor="pointer"
                  onClick={() => handleItemClick(item)}
                  p="0 15px 15px 15px"
                  _hover={{
                    bg: '#E9C378',
                    fontWeight: '500'
                  }}
                >
                  <Box pt="15px">
                    {item}
                    {items.length - 1 !== index ? (
                      <Divider
                        position={'relative'}
                        top={'15px'}
                      />
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Flex>
      <Flex
        flexDir={'column'}
        mt={'20px'}
        rowGap={'5px'}
      >
        <Text
          fontSize={'15px'}
          fontWeight={600}
          color={'#183831'}
        >
          {t.service}
        </Text>
        <Flex>
          <Input
            boxShadow="0px 0px 24px rgba(0, 0, 0, 0.10)"
            borderRightRadius={'unset'}
            p={'26px 15px'}
            type="text"
            name="search_input"
            color={'#747474'}
            placeholder="Mediation, arbitriation, Lawyers....."
            onChange={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
            onKeyDown={event => event.key === 'Enter' && navigateToSearchResults()}
            _focusVisible={{
              borderColor: 'transparent',
              boxShadow: 'transparent'
            }}
          />
          <Flex
            bg={'rgba(var(--color-primary))'}
            borderRightRadius={'6px'}
            boxShadow="0px 0px 24px rgba(0, 0, 0, 0.10)"
            justifyContent={'center'}
            alignItems="center"
            aria-disabled={isButtonDisabled}
            width={'55px'}
            cursor={isButtonDisabled ? 'not-allowed' : 'pointer'}
            onClick={isButtonDisabled ? undefined : navigateToSearchResults}
            _disabled={{
              backgroundColor: 'B89092',
              opacity: 0.5
            }}
          >
            <Image
              src="/images/searchIcon.svg"
              onClick={e => {
                if (searchTerm) {
                  navigateToSearchResults()
                }
                e.preventDefault()
              }}
              alt={'search icon'}
            />
          </Flex>
        </Flex>
      </Flex>
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
