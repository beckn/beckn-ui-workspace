import React, { useEffect, useState } from 'react'
import { Box, Flex, Image, Input } from '@chakra-ui/react'
import { SearchBarProps } from './searchBar.types'
import { testIds } from '@shared/dataTestIds'

const SearchBar: React.FC<SearchBarProps> = ({ searchString, handleChange, placeholder = 'Search', selectedInput }) => {
  const [searchText, setSearchText] = useState<string | string[] | undefined>(searchString)
  const [inputValue, setInputValue] = useState<string | string[] | undefined>('')

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setSearchText(event.target.value)
  }
  useEffect(() => {
    setInputValue(selectedInput ? `${selectedInput} ; ${searchText}` : searchText)
  }, [searchText, selectedInput])

  const handleSubmit = () => {
    handleChange(searchText)
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
          _focus={{ outline: 'none' }}
          _focusVisible={{ zIndex: 1, borderColor: '#3182ce', boxShadow: '0 0 0 0 #3182ce' }}
          w="full"
          type="search"
          placeholder={placeholder}
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
        >
          <Image src={'/images/searchInput.svg'} />
        </Box>
      </Flex>
    </Box>
  )
}

export default SearchBar
