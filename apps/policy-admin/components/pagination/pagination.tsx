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
  const maxPageNumbersToShow = 5

  const halfWay = Math.floor(maxPageNumbersToShow / 2)
  let startPage = Math.max(1, currentPage - halfWay)
  let endPage = Math.min(totalPages, currentPage + halfWay)

  if (currentPage <= halfWay) {
    endPage = Math.min(totalPages, maxPageNumbersToShow)
  } else if (currentPage + halfWay >= totalPages) {
    startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1)
  }

  if (startPage > 1) {
    pageNumbers.push(1)
    if (startPage > 2) {
      pageNumbers.push('...')
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push('...')
    }
    pageNumbers.push(totalPages)
  }

  return (
    <Flex
      justifyContent="end"
      mt={4}
      alignItems="center"
      width={'fit-content'}
      float="right"
      border={'1px solid #e6e8ee'}
    >
      <IconButton
        icon={<ChevronLeftIcon />}
        aria-label="Previous page"
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        size="sm"
        borderRadius="0px"
        mb="0px"
      />

      {pageNumbers.map((pageNumber, index) =>
        typeof pageNumber === 'number' ? (
          <Button
            key={index}
            onClick={() => handlePageChange(pageNumber)}
            isActive={pageNumber === currentPage}
            size="sm"
            borderRadius="0px"
            mb="0px"
            backgroundColor={'#ffffff'}
            borderLeft={pageNumber === currentPage ? `1px solid #e6e8ee` : ''}
            borderRight={pageNumber === currentPage ? `1px solid #e6e8ee` : ''}
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
        icon={<ChevronRightIcon />}
        aria-label="Next page"
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        size="sm"
        borderRadius="0px"
        mb="0px"
      />
    </Flex>
  )
}

export default Pagination
