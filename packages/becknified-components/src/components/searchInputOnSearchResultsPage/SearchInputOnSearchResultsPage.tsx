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
    <Box className={Styles.search_input_container}>
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
