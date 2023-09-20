import React from 'react'
import Styles from './JobSearch.module.css'
import SearchBar from '../header/SearchBar'
import JobsCard from './JobsCard'

import { Box } from '@chakra-ui/react'

const response = [
  {
    position: 'Senior UI Analyst',
    companyName: 'EMinds',
    location: 'Pune, Maharashtra',
    platformName: 'BuyZilla'
  },
  {
    position: 'Data Analyst',
    companyName: 'Infosys',
    location: 'Bangalore, Karnataka',
    platformName: 'BuyZilla'
  }
]

const JobSearch = () => {
  const renderedItems = response.map((res, index) => {
    return <JobsCard response={res} key={index} />
  })
  return (
    <div className={Styles.container}>
      <SearchBar className={Styles.searchBar} searchString={''} handleChange={() => {}} />
      <Box>{renderedItems}</Box>
    </div>
  )
}

export default JobSearch
