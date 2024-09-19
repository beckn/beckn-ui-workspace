import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Box, Flex, Badge, Button, Text } from '@chakra-ui/react'
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { Typography } from '@beckn-ui/molecules'
import { formatDate } from '@utils/general'
import { useRouter } from 'next/router'
import { DataTableProps } from '@lib/types/table'
import Pagination from '@components/pagination/pagination'

const DataTable = (props: DataTableProps) => {
  const { items, meta, fetchData, currentTab } = props
  const [sortConfig, setSortConfig] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(meta.start / meta.limit + 1)
  const [totalPages, setTotalPages] = useState(Math.ceil(meta.total / meta.limit) || 1)

  const router = useRouter()

  useEffect(() => {
    setTotalPages(Math.ceil(meta.total / meta.limit) || 1)
  }, [meta])

  useEffect(() => {
    setCurrentPage(1)
  }, [currentTab])

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
        fetchData(newPage, sortConfig)
      }
    },
    [sortConfig, totalPages]
  )

  const requestSort = (key: string) => {
    let order = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc'
    }
    setSortConfig({ key, order })
    fetchData(currentPage, { key: key === 'description' ? 'short_description' : key, order })
  }

  const getIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <Flex flexDirection={'column'}>
          <TriangleUpIcon /> <TriangleDownIcon />
        </Flex>
      )
    }
    return sortConfig.order === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />
  }

  return (
    <>
      <Box
        maxH={{ base: 'calc(100vh - 278px)', md: 'calc(100vh - 430px)' }}
        overflowY="scroll"
        overflowX="scroll"
        className="hideScroll"
      >
        <Table variant="simple">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={1}
          >
            <Tr background={'linear-gradient(90.16deg,rgba(0, 78, 146, 0.1) 1.48%,rgba(0, 4, 40, 0.1) 100%)'}>
              <Th>
                <Box
                  display="flex"
                  alignItems="center"
                  width={'200px'}
                >
                  Title
                  <IconButton
                    ml={2}
                    mb={0}
                    fontSize="65%"
                    size="s"
                    aria-label="title"
                    icon={getIcon('name')!}
                    onClick={() => requestSort('name')}
                  />
                </Box>
              </Th>
              <Th>
                <Box
                  display="flex"
                  alignItems="center"
                  width={'300px'}
                >
                  Description
                  <IconButton
                    ml={2}
                    mb={0}
                    fontSize="65%"
                    size="s"
                    aria-label="descption"
                    icon={getIcon('description')!}
                    onClick={() => requestSort('description')}
                  />
                </Box>
              </Th>
              <Th>
                <Box
                  display="flex"
                  alignItems="center"
                  width={'100px'}
                >
                  Status
                  <IconButton
                    ml={2}
                    mb={0}
                    fontSize="65%"
                    size="s"
                    aria-label="status"
                    icon={getIcon('status')!}
                    onClick={() => requestSort('status')}
                  />
                </Box>
              </Th>
              <Th>
                <Box
                  display="flex"
                  alignItems="center"
                  width={'100px'}
                >
                  Start Date
                  <IconButton
                    ml={2}
                    mb={0}
                    fontSize="65%"
                    size="s"
                    aria-label="startDate"
                    // icon={getIcon('startDate')!}
                    // onClick={() => requestSort('startDate')}
                  />
                </Box>
              </Th>
              <Th>
                <Box
                  display="flex"
                  alignItems="center"
                  width={'100px'}
                >
                  End Date
                  <IconButton
                    ml={2}
                    mb={0}
                    fontSize="65%"
                    size="s"
                    aria-label="endDate"
                    // icon={getIcon('endDate')!}
                    // onClick={() => requestSort('endDate')}
                  />
                </Box>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <Tr
                  key={index}
                  cursor="pointer"
                  _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                  onClick={() => {
                    router.push({
                      pathname: `/policyDetails`,
                      query: { policyId: item.id }
                    })
                  }}
                >
                  <Td borderBottom={'1px dotted #004e92!important'}>
                    <Typography
                      text={item.name}
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        width: '200px'
                      }}
                    />
                  </Td>
                  <Td borderBottom={'1px dotted #004e92!important'}>
                    <Typography
                      text={item.description}
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        width: '300px'
                      }}
                    />
                  </Td>
                  <Td borderBottom={'1px dotted #004e92!important'}>
                    <Badge
                      variant="subtle"
                      textTransform="lowercase"
                      colorScheme={
                        item.status === 'active'
                          ? 'green'
                          : item.status === 'inactive'
                            ? 'red'
                            : item.status === 'new'
                              ? 'purple'
                              : 'blue'
                      }
                    >
                      <Typography text={item.status} />
                    </Badge>
                  </Td>
                  <Td borderBottom={'1px dotted #004e92!important'}>
                    <Typography
                      text={formatDate(item.startDate)}
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        width: '100px'
                      }}
                    />
                  </Td>
                  <Td borderBottom={'1px dotted #004e92!important'}>
                    <Typography
                      text={formatDate(item.endDate)}
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        width: '100px'
                      }}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5}>
                  <Typography
                    text="No rows"
                    fontWeight="600"
                    style={{ textAlign: 'center' }}
                  />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </>
  )
}

export default DataTable
