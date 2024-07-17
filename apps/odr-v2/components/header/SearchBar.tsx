import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { SearchBarPropsModel } from '../../lib/types/search'
import { Box, Flex, Image, Input } from '@chakra-ui/react'

const SearchBar: React.FC<SearchBarPropsModel> = ({ searchString, handleChange, selectedCategory }) => {
  const { t } = useLanguage()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(selectedCategory ? `${selectedCategory} ; ${searchString}` : searchString)
  }, [searchString, selectedCategory])

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = () => {
    const [newCategory, ...newSearchTextParts] = inputValue.split(' ; ')
    const newSearchText = newSearchTextParts.join(' ; ')
    handleChange(!newCategory ? `${newCategory} ; ${newSearchText}` : newSearchText)
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
          value={inputValue}
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
