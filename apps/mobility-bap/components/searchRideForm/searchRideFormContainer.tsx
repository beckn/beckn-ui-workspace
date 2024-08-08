import React from 'react'
import SearchRideForm from './SearchRideForm'

interface SearchRideFormContainerProps {
  handleOnClick: () => void
}

const SearchRideFormContainer: React.FC<SearchRideFormContainerProps> = ({ handleOnClick }) => {
  return <SearchRideForm onClick={handleOnClick} />
}

export default SearchRideFormContainer
