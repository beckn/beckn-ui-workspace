import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Image, Table, Tbody, Td, Tr, useTheme } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import ArrowOut from '@public/images/arrow_outward.svg'
import ArrowDown from '@public/images/arrow_downward.svg'
import EmptyTransactionsIcon from '@public/images/empty_transactions.svg'
import { formatDate } from '@beckn-ui/common'
import Pagination from '@components/pagination/pagination'
import EmptyCurrentTrade from '@components/EmptyTemplates/EmptyScreenTemplate'
import { useRouter } from 'next/router'
import SelectDate from '@components/dateRangePicker/SelectDate'

export interface TransactionMeta {
  transactionType: 'ADD_FUND' | 'WITHDRAW_FUND' | 'SELLORDER' | 'BUYORDER'
  name: string
  date: string
  amount: number
}

const TransactionMap = {
  ADD_FUND: 'Deposit',
  WITHDRAW_FUND: 'Withdraw',
  SELLORDER: 'Sell Order',
  BUYORDER: 'Buy Order'
}

enum TransactionType {
  ADD_FUND = 'ADD_FUND',
  WITHDRAW_FUND = 'WITHDRAW_FUND',
  SELLORDER = 'SELLORDER',
  BUYORDER = 'BUYORDER'
}

const assetHeaderName = {
  fund: 'Current Balance',
  energy: 'Total Energy Voucher'
}

interface TransactionTemplateProps {
  assetType: 'fund' | 'energy'
  assetValue: string | number
  isCustomDateModalOpen: boolean
  filterIndex: number
  items: TransactionMeta[]
  totalPages: number
  customStartDate: string
  customEndDate: string
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  handleOnFilterChange?: (index: number) => void
  handleCustomDateModalClose?: () => void
  handleDateChange?: (start: string, end: string) => void
}

const AssetTransactionTemplate = (props: TransactionTemplateProps) => {
  const {
    assetType,
    assetValue,
    isCustomDateModalOpen,
    totalPages,
    filterIndex,
    items,
    customEndDate,
    customStartDate,
    currentPage,
    setCurrentPage,
    handleOnFilterChange,
    handleCustomDateModalClose,
    handleDateChange
  } = props

  const router = useRouter()
  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
      }
    },
    [totalPages]
  )

  return (
    <>
      <Flex
        width={'335px'}
        gap="1rem"
        backgroundColor={primaryColor}
        borderRadius="12px"
        p="1rem"
        flexDir={'column'}
        justifyContent="space-around"
        boxShadow="0px 20px 25px 0px #0000001A"
      >
        <Typography
          text={assetHeaderName[assetType]}
          fontSize="15px"
          color="#ffffff"
        />
        <Typography
          text={assetValue}
          fontSize="24px"
          color="#ffffff"
        />
        {assetType === 'fund' && (
          <Flex gap="1rem">
            <BecknButton
              text="Withdraw"
              handleClick={() => router.push('/withdraw')}
              variant="outline"
              sx={{
                color: '#000000',
                borderColor: '#ffffff',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '1rem 0',
                borderRadius: '20px',
                height: '1.5rem',
                marginBottom: '0px'
              }}
              leftIcon={
                <Image
                  src={ArrowOut}
                  alt="withdraw-icon"
                />
              }
            />
            <BecknButton
              text="Deposit"
              handleClick={() => router.push('/paymentMode')}
              variant="outline"
              sx={{
                color: '#000000',
                borderColor: '#ffffff',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '1rem 0',
                borderRadius: '20px',
                height: '1.5rem',
                marginBottom: '0px'
              }}
              leftIcon={
                <Image
                  src={ArrowDown}
                  alt="deposit-icon"
                />
              }
            />
          </Flex>
        )}
      </Flex>
      <Flex
        flexDirection={'column'}
        width={'100%'}
        p="2rem 1rem"
        gap="1rem"
      >
        <Flex
          flexDirection={'row'}
          justifyContent={'space-between'}
          width={'100%'}
        >
          <Typography
            text="Transactions"
            fontWeight="500"
            fontSize="15px !important"
          />
          {/* <Typography
            text="View all"
            color="#4498E8"
          /> */}
        </Flex>
        {filterIndex > 0 || items.length > 0 ? (
          <>
            <Flex
              flexDirection={'row'}
              justifyContent="space-between"
            >
              {['Latest', 'last 7 Days', 'Custom Date'].map((name, index) => (
                <Typography
                  text={name}
                  sx={{
                    backgroundColor: filterIndex === index ? primaryColor : '#ffffff',
                    borderRadius: '20px',
                    padding: '1.8% 6%',
                    color: filterIndex === index ? '#ffffff' : '#000000',
                    border: `1px solid ${filterIndex === index ? 'transparent' : '#000000'}`
                  }}
                  onClick={() => handleOnFilterChange?.(index)}
                />
              ))}
            </Flex>

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
                          {(item.transactionType === TransactionType.WITHDRAW_FUND ||
                            item.transactionType === TransactionType.SELLORDER) && (
                            <Box
                              width={'36px'}
                              height={'36px'}
                              alignContent="center"
                              justifyItems="center"
                              borderRadius="20px"
                              boxShadow="14px 6px 24px 2px #0000001A"
                            >
                              <Image src={ArrowOut} />
                            </Box>
                          )}
                          {(item.transactionType === TransactionType.ADD_FUND ||
                            item.transactionType === TransactionType.BUYORDER) && (
                            <Box
                              width={'36px'}
                              height={'36px'}
                              alignContent="center"
                              justifyItems="center"
                              borderRadius="20px"
                              boxShadow="14px 6px 24px 2px #0000001A"
                            >
                              <Image src={ArrowDown} />
                            </Box>
                          )}
                          <Flex flexDir={'column'}>
                            <Typography
                              text={TransactionMap[item.transactionType]}
                              style={{
                                fontWeight: '400',
                                fontSize: '14px',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal'
                              }}
                            />
                            <Typography
                              text={formatDate(item.date, 'yyyy-MM-dd')}
                              style={{
                                fontSize: '12px',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                opacity: '40%'
                              }}
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
                          style={{
                            fontWeight: '500',
                            fontSize: '16px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            textAlign: 'end'
                          }}
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
        ) : (
          <Box marginTop={'6rem'}>
            <EmptyCurrentTrade
              text={'There’s no transactions till now!'}
              src={EmptyTransactionsIcon}
            />
          </Box>
        )}
      </Flex>
      <SelectDate
        isOpen={isCustomDateModalOpen}
        onClose={handleCustomDateModalClose!}
        onDateSelect={handleDateChange!}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </>
  )
}

export default AssetTransactionTemplate
