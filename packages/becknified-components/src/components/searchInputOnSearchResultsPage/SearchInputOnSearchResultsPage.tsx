import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { SearchInputOnSearchResultsPageProps } from './SearchInputOnSearchResultsPage.types'
import Styles from './search-input-on-results-page.module.css'

const SearchInputOnSearchResultsPage: React.FC<SearchInputOnSearchResultsPageProps> = props => {
  const { handleSubmit, searchText, setSearchText } = props

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setSearchText(event.target.value)
  }

  return (
    <Box
      maxWidth={'50rem'}
      pl={'1rem'}
      pr={'1rem'}
      backgroundColor={'white'}
      display={'flex'}
      alignItems={'center'}
      flexGrow={1}
      borderRadius={'0.25rem'}
      border={'1px solid #c9c9c9'}
      margin={'20px auto'}
      width={'calc(100% - 40px)'}
    >
      <input
        className={Styles.search_input}
        type="search"
        placeholder={'Search'}
        onChange={inputChangeHandler}
        value={searchText}
        onKeyDown={event => event.key === 'Enter' && handleSubmit()}
      />
    </Box>
  )
}

export default SearchInputOnSearchResultsPage
