import React, { useState } from 'react'
import styles from '../styles/SearchInput.module.css'

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
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className={styles.searchButton}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  )
}

export default SearchInput
