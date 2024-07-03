import React, { useState } from 'react'
import { Box, Flex, Image, Input } from '@chakra-ui/react'
import { SearchBarProps } from './searchBar.types'

const SearchBar: React.FC<SearchBarProps> = ({ searchString, handleChange, placeholder = 'Search' }) => {
  const [searchText, setSearchText] = useState(searchString)

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setSearchText(event.target.value)
  }

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
          value={searchText}
          onKeyDown={event => event.key === 'Enter' && handleSubmit()}
        />
        <Box
          position={'absolute'}
          right={'12px'}
          top={'12px'}
          onClick={handleSubmit}
        >
          <Image src={'/images/searchInput.svg'} />
        </Box>
      </Flex>
    </Box>
  )
}

export default SearchBar
