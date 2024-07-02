import React, { useState } from 'react'
import { Box, Flex, Image, Input } from '@chakra-ui/react'
import { SearchBarProps } from '../../../lib/types/components'

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
      <Flex>
        <Input
          p={'20px'}
          bg="transparent"
          borderRadius={'12px'}
          _focus={{ outline: 'none' }}
          w="full"
          type="search"
          placeholder={placeholder}
          onChange={inputChangeHandler}
          value={searchText}
          onKeyDown={event => event.key === 'Enter' && handleSubmit()}
        />
        <Box
          position={'relative'}
          right={'30px'}
          top={'13px'}
          onClick={handleSubmit}
        >
          <Image src={'/images/searchInput.svg'} />
        </Box>
      </Flex>
    </Box>
  )
}

export default SearchBar
