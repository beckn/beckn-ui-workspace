import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { SearchBarPropsModel } from '../../lib/types/search'
import { Box, Flex, Image, Input } from '@chakra-ui/react'

const SearchBar: React.FC<SearchBarPropsModel> = ({ searchString, handleChange, selectedCategory }) => {
  const { t } = useLanguage()
  const [searchText, setSearchText] = useState(searchString)

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setSearchText(event.target.value)
  }

  const handleSubmit = () => {
    handleChange(searchText)
  }
  const getInputValue = () => {
    if (selectedCategory?.length && searchText?.length) {
      return `${selectedCategory} ; ${searchText}`
    }
    return selectedCategory || searchText || ''
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
          placeholder={t.search}
          onChange={inputChangeHandler}
          value={getInputValue()}
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
