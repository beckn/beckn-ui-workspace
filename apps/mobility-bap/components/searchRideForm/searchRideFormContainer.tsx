import React from 'react'
import SearchRideForm from './SearchRideForm'

interface SearchRideFormContainerProps {
  handleOnClick: () => void
}

const SearchRideFormContainer: React.FC<SearchRideFormContainerProps> = ({ handleOnClick }) => {
  const cabDetails = { name: 'Ola Mini', waitTime: '5 mins away', fare: '₹80' }
  const location = { pickup: 'Katraj', dropOff: 'Phoenix Mall' }
  const optionsList = {
    rideTimeOptionsList: [
      {
        label: 'Ride Now',
        value: 'ridenow',
        tag: 'rideTimeOptions'
      },
      {
        label: 'Ride Later',
        value: 'ridelater',
        tag: 'rideTimeOptions'
      }
    ],
    riderOptionsList: [
      {
        label: 'Myself',
        value: 'myself',
        tag: 'riderOptions'
      },
      {
        label: 'Others',
        value: 'others',
        tag: 'riderOptions'
      }
    ]
  }
  return (
    <SearchRideForm
      cabDetails={cabDetails}
      location={location}
      optionsList={optionsList}
      onClick={handleOnClick}
    />
  )
}

export default SearchRideFormContainer
