import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { SearchBarPropsModel } from '../../lib/types/search'
import { Box, Flex, Image, Input } from '@chakra-ui/react'

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
      width="100%"
      margin="30px auto"
    >
      <Box position={'relative'}>
        <Input
          p={'26px'}
          bg="#fff"
          borderRadius={'unset'}
          borderBottomLeftRadius={'12px'}
          borderTopLeftRadius={'12px'}
          _focus={{ outline: 'none' }}
          w="calc(100% - 54px)"
          type="search"
          placeholder={t.search}
          onChange={inputChangeHandler}
          value={searchText}
          onKeyDown={event => event.key === 'Enter' && handleSubmit()}
        />
        <Flex
          alignItems={'center'}
          justifyContent="center"
          borderBottomRightRadius={'12px'}
          borderTopRightRadius={'12px'}
          position={'absolute'}
          right={'0'}
          top={'0'}
          background="#387F9A"
          height="54px"
          w={'54px'}
          onClick={handleSubmit}
        >
          <Image src={'/images/searchInput.svg'} />
        </Flex>
      </Box>
    </Box>
  )
}

export default SearchBar
