import React from 'react'
import { Box } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
//types
import { SearchProps } from './search.types'
//styles
import Styles from './search.module.css'

const Search: React.FC<SearchProps> = ({ handleOnChange, handlePressEnter, handleOnSearchClick }) => {
  return (
    <Box className={Styles.input_group}>
      <input
        className={Styles.input_box}
        type="text"
        name="search_input"
        placeholder="Search for courses"
        onChange={(e: React.BaseSyntheticEvent) => handleOnChange(e.target.value)}
        onKeyDown={event => event.key === 'Enter' && handlePressEnter()}
      />
      <button className={Styles.search_button}>
        <FaSearch
          onClick={e => {
            e.preventDefault()
            handleOnSearchClick()
          }}
        />
      </button>
    </Box>
  )
}

export default Search
