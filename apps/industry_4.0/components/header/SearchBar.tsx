import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { SearchBarPropsModel } from '../../lib/types/search'
import { Box, Input } from '@chakra-ui/react'

const SearchBar: React.FC<SearchBarPropsModel> = ({ searchString, handleChange }) => {
  const { t } = useLanguage()
  const [searchText, setSearchText] = useState(searchString)

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setSearchText(event.target.value)
  }

  const handleSubmit = () => {
    handleChange(searchText)
  }

  return (
    <Box
      width="calc(100% - 40px)"
      margin="20px auto"
    >
      <Input
        p={'20px'}
        bg="transparent"
        borderRadius={'12px'}
        _focus={{ outline: 'none' }}
        _focusVisible={'none'}
        w="full"
        type="search"
        placeholder={t.search}
        onChange={inputChangeHandler}
        value={searchText}
        onKeyDown={event => event.key === 'Enter' && handleSubmit()}
      />
    </Box>
  )
}

export default SearchBar
