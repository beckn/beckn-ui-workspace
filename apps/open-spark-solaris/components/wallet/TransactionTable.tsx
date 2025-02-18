import React from 'react'
import { Box, Table, Tbody, Tr, Td, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { formatDate } from '@beckn-ui/common'
import Pagination from '@components/pagination/pagination'
import { TransactionMeta, TransactionType } from '@pages/myFunds'

interface TransactionTableProps {
  items: TransactionMeta[]
  currentPage: number
  totalPages: number
  handlePageChange: (page: number) => void
  TransactionMap: Record<TransactionType, string>
  ArrowOut: string
  ArrowDown: string
}

const iconBoxStyle = {
  width: '36px',
  height: '36px',
  alignContent: 'center',
  justifyItems: 'center',
  borderRadius: '20px',
  boxShadow: '14px 6px 24px 2px #0000001A'
}

const transactionTextStyle = {
  fontWeight: '400',
  fontSize: '14px',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '2',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal'
}

const dateTextStyle = {
  fontSize: '12px',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '2',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
  opacity: '40%'
}

const amountTextStyle = {
  fontWeight: '500',
  fontSize: '16px',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '2',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
  textAlign: 'end'
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  items,
  currentPage,
  totalPages,
  handlePageChange,
  TransactionMap,
  ArrowOut,
  ArrowDown
}) => {
  return (
    <>
      <Box
        height={{ base: 'calc(100vh - 29rem)', md: 'calc(100vh - 30rem)' }}
        overflowY="scroll"
        overflowX="scroll"
        className="hideScroll"
      >
        <Table variant="simple">
          <Tbody>
            {items.map((item, index: number) => (
              <Tr
                key={index}
                cursor="pointer"
                _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
              >
                <Td
                  borderBottom={'1px dotted transparent !important'}
                  padding="6px 0px"
                >
                  <Flex
                    flexDirection={'row'}
                    gap="0.5rem"
                  >
                    {item.transactionType === TransactionType.WITHDRAW_FUND && (
                      <Box {...iconBoxStyle}>
                        <Image
                          src={ArrowOut}
                          alt="withdraw"
                        />
                      </Box>
                    )}
                    {item.transactionType === TransactionType.ADD_FUND && (
                      <Box {...iconBoxStyle}>
                        <Image
                          src={ArrowDown}
                          alt="deposit"
                        />
                      </Box>
                    )}
                    <Flex flexDir={'column'}>
                      <Typography
                        text={TransactionMap[item.transactionType]}
                        sx={transactionTextStyle}
                      />
                      <Typography
                        text={formatDate(item.date, 'yyyy-MM-dd')}
                        sx={dateTextStyle}
                      />
                    </Flex>
                  </Flex>
                </Td>
                <Td
                  borderBottom={'1px dotted transparent !important'}
                  padding="6px 0px"
                >
                  <Typography
                    text={`${item.transactionType === TransactionType.ADD_FUND ? '+' : '-'}₹ ${item.amount}`}
                    sx={amountTextStyle}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {items.length > 6 && (
        <Box
          width={'100%'}
          bottom="0"
          margin="1rem 0"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Box>
      )}
    </>
  )
}

export default TransactionTable
