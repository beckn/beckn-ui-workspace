import React from 'react'
import { Flex, Button, Box, IconButton, Text } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

interface PaginationProps {
  currentPage: number
  totalPages: number
  handlePageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
  const pageNumbers = []
  const maxPageNumbersToShow = 3

  const halfWay = Math.floor(maxPageNumbersToShow / 2)
  let startPage = Math.max(1, currentPage - halfWay)
  let endPage = Math.min(totalPages, currentPage + halfWay)

  if (currentPage <= halfWay) {
    endPage = Math.min(totalPages, maxPageNumbersToShow)
  } else if (currentPage + halfWay >= totalPages) {
    startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    if (pageNumbers.length < 3) {
      pageNumbers.push(i)
    }
  }

  return (
    <Flex
      justifyContent="end"
      alignItems="center"
      width={'fit-content'}
      float="right"
    >
      <IconButton
        icon={
          <ChevronLeftIcon
            color={currentPage === 1 ? '#9C9C9C' : '#4498E8'}
            width={'20px'}
            height={'20px'}
          />
        }
        background={'#ffffff'}
        aria-label="Previous page"
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        size="sm"
        mb="0px"
      />

      {pageNumbers.map((pageNumber, index) =>
        typeof pageNumber === 'number' ? (
          <Button
            key={index}
            onClick={() => handlePageChange(pageNumber)}
            isActive={pageNumber === currentPage}
            size="sm"
            mb="0px"
            background={'#ffffff !important'}
            color={pageNumber === currentPage ? '#4498E8' : '#9C9C9C'}
            data-test={'pagination-number'}
          >
            {pageNumber}
          </Button>
        ) : (
          <Text
            key={index}
            px={2}
            size="sm"
            mb="0px"
          >
            {pageNumber}
          </Text>
        )
      )}

      <IconButton
        icon={
          <ChevronRightIcon
            color={currentPage === totalPages ? '#9C9C9C' : '#4498E8'}
            width={'20px'}
            height={'20px'}
          />
        }
        background={'#ffffff'}
        aria-label="Next page"
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        size="sm"
        mb="0px"
      />
    </Flex>
  )
}

export default Pagination
