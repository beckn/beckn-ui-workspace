import React, { useEffect, useState } from 'react'
import { Box, Flex, Image, Input } from '@chakra-ui/react'
import { SearchBarProps } from './searchBar.types'
import { testIds } from '@shared/dataTestIds'

const SearchBar: React.FC<SearchBarProps> = ({ searchString, handleChange, placeholder = 'Search', selectedInput }) => {
  const [inputValue, setInputValue] = useState('')

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setInputValue(event.target.value)
  }
  useEffect(() => {
    // Convert searchString to a string, handling arrays and undefined cases
    const safeSearchString = searchString
      ? Array.isArray(searchString)
        ? searchString.join(',')
        : String(searchString)
      : ''

    setInputValue(selectedInput ? `${selectedInput} ; ${safeSearchString}` : safeSearchString)
  }, [searchString, selectedInput])

  const handleSubmit = () => {
    const [newCategory, ...newSearchTextParts] = inputValue.split(' ; ')
    const newSearchText = newSearchTextParts.join(' ; ')
    handleChange(newCategory && newSearchTextParts.length > 0 ? `${newCategory} ; ${newSearchText}` : inputValue)
  }

  return (
    <Box
      width="100%"
      margin="20px auto"
    >
      <Flex position={'relative'}>
        <Input
          p={'20px'}
          bg="transparent"
          borderRadius={'12px'}
          _focus={{ outline: 'none', backgroundColor: '#ffffff' }}
          _focusVisible={{ zIndex: 1, borderColor: '#3182ce', boxShadow: '0 0 0 0 #3182ce' }}
          w="full"
          type="search"
          placeholder={placeholder}
          backgroundColor={'#ffffff'}
          onChange={inputChangeHandler}
          data-test={testIds.searchInput}
          value={inputValue}
          onKeyDown={event => event.key === 'Enter' && handleSubmit()}
        />
        <Box
          position={'absolute'}
          right={'12px'}
          top={'12px'}
          data-test={testIds.searchButton}
          onClick={handleSubmit}
          cursor={'pointer'}
          zIndex={9999}
          backgroundColor={'#ffffff'}
          padding={'0px 3px'}
        >
          <Image src={'/images/searchInput.svg'} />
        </Box>
      </Flex>
    </Box>
  )
}

export default SearchBar
