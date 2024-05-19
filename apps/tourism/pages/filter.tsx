import { Box, Image } from '@chakra-ui/react'
import BottomModal from '@components/BottomModal'
import Filter from '@components/filter/Filter'
import React, { useState } from 'react'

const filter = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }
  return (
    <>
      <Box display={['block', 'block', 'block', 'none']}>
        <Image
          onClick={() => setIsFilterOpen(true)}
          cursor={'pointer'}
          src="./images/filter-btn.svg"
          alt=""
        />
      </Box>
      <Box display={['none', 'none', 'none', 'block']}>
        <Filter />
      </Box>
      <Box display={['block', 'none', 'none', 'none']}>
        <BottomModal
          isOpen={isFilterOpen}
          onClose={handleFilterClose}
          children={<Filter />}
        />
      </Box>
      <Box display={['none', 'block', 'block', 'none']}>
        <Filter />
      </Box>
    </>
  )
}

export default filter
