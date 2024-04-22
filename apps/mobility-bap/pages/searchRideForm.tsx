import SearchRideForm from '@/components/searchRideForm/SearchRideForm'
import React from 'react'
import { mockData } from 'utilities/cabDetails'

const searchRideForm = () => {
  const {
    data: [
      {
        cabCategory: {
          mini: { cabDetails }
        },
        location,
        optionsList
      }
    ]
  } = mockData

  return (
    <div>
      <SearchRideForm
        cabDetails={cabDetails}
        location={location}
        optionsList={optionsList}
      />
    </div>
  )
}

export default searchRideForm
