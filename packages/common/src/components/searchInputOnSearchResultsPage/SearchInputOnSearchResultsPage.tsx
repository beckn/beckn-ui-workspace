import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { SearchInputOnSearchResultsPageProps } from './SearchInputOnSearchResultsPage.types'

const SearchInputOnSearchResultsPage: React.FC<SearchInputOnSearchResultsPageProps> = props => {
  const { handleSubmit, searchText, setSearchText } = props

  const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
    setSearchText(event.target.value)
  }

  return (
    <Box
      className="max-w-[50rem] w-full md:w-[90%] px-4 md:ltr:ml-4 md:rtl:mr-4  dark:bg-slate-800 flex items-center flex-grow border_radius_all  pl-5 "
      border={'1px solid #c9c9c9'}
      width={'calc(100% - 40px)'}
      margin={'20px auto'}
    >
      <input
        className=" py-2 md:py-3 bg-transparent outline-none w-full"
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
