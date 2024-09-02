import React, { useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Box, Flex, Badge } from '@chakra-ui/react'
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { DataTableProps } from '@components/tabPanel/tabPanel'
import { Typography } from '@beckn-ui/molecules'
import { formatDate } from '@utils/general'

// const data = [
//   { title: 'Disruption of Traffic - BTM Layout', description: '', status: 'applied', startDate: '24/03/2023', endDate: '24/03/2023' },
//   { title: 'Traffic Advisory - Whitefield', description: '', status: 'inactive', startDate: '28/03/2023', endDate: '28/03/2023' },
//   { title: 'Heavy Traffic Zone - Koramangala', description: '', status: 'applied', startDate: '22/03/2023', endDate: '22/03/2023' },
//   // ... Add more data as needed
// ];

const DataTable = (props: DataTableProps) => {
  const { items } = props
  const [sortConfig, setSortConfig] = useState<any>(null)

  const sortedData = React.useMemo(() => {
    let sortableData = [...items]
    if (sortConfig !== null) {
      sortableData.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }, [sortConfig, items])

  const requestSort = (key: string) => {
    let direction = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <Flex flexDirection={'column'}>
          <TriangleUpIcon /> <TriangleDownIcon />
        </Flex>
      )
    }
    return sortConfig.direction === 'ascending' ? <TriangleUpIcon /> : <TriangleDownIcon />
  }

  return (
    <Box
      maxH={'calc(100vh - 360px)'}
      overflowY="auto"
      overflowX="hidden"
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
                width={'300px'}
              >
                Title
                <IconButton
                  ml={2}
                  mb={0}
                  fontSize="65%"
                  size="s"
                  aria-label="title"
                  icon={getIcon('title')!}
                  onClick={() => requestSort('title')}
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
                width={'200px'}
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
                width={'200px'}
              >
                Start Date
                <IconButton
                  ml={2}
                  mb={0}
                  fontSize="65%"
                  size="s"
                  aria-label="startDate"
                  icon={getIcon('startDate')!}
                  onClick={() => requestSort('startDate')}
                />
              </Box>
            </Th>
            <Th>
              <Box
                display="flex"
                alignItems="center"
                width={'200px'}
              >
                End Date
                <IconButton
                  ml={2}
                  mb={0}
                  fontSize="65%"
                  size="s"
                  aria-label="endDate"
                  icon={getIcon('endDate')!}
                  onClick={() => requestSort('endDate')}
                />
              </Box>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((item, index) => (
            <Tr key={index}>
              <Td borderBottom={'1px dotted #004e92!important'}>
                <Typography
                  text={item.title}
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: '2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal'
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
                    whiteSpace: 'normal'
                  }}
                />
              </Td>
              <Td borderBottom={'1px dotted #004e92!important'}>
                {item.status === 'active' && (
                  <Badge
                    variant="subtle"
                    colorScheme={'green'}
                    textTransform="lowercase"
                  >
                    <Typography text={item.status} />
                  </Badge>
                )}
                {item.status === 'inactive' && (
                  <Badge
                    variant="subtle"
                    colorScheme={'red'}
                    textTransform="lowercase"
                  >
                    <Typography text={item.status} />
                  </Badge>
                )}
                {item.status === 'published' && (
                  <Badge
                    variant="subtle"
                    textTransform="lowercase"
                  >
                    <Typography text={item.status} />
                  </Badge>
                )}
                {item.status === 'new' && (
                  <Badge
                    variant="subtle"
                    colorScheme={'purple'}
                    textTransform="lowercase"
                  >
                    <Typography text={item.status} />
                  </Badge>
                )}
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
                    whiteSpace: 'normal'
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
                    whiteSpace: 'normal'
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default DataTable
