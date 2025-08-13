import React, { useState } from 'react'
import styles from '../styles/SearchInput.module.css'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SearchInputProps {
  placeholder: string
  onSearch: (query: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onSearch }) => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    onSearch(searchValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <FontAwesomeIcon
          icon={faSearch}
          className={styles.searchIcon}
        />
        <input
          type="text"
          placeholder={placeholder}
          className={styles.searchInput}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <button
        className={styles.searchButton}
        onClick={handleSearch}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className={styles.buttonIcon}
        />
        Search
      </button>
    </div>
  )
}

export default SearchInput
