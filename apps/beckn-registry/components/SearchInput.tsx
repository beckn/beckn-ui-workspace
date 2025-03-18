import React from 'react'
import styles from '../styles/SearchInput.module.css'

interface SearchInputProps {
  placeholder: string
  onSearch: () => void
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onSearch }) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
      />
      <button
        className={styles.searchButton}
        onClick={onSearch}
      >
        Search
      </button>
    </div>
  )
}

export default SearchInput
