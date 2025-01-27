import { feedbackActions, formatDate, TopSheet, useGeolocation } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import NavIcon from '@public/images/nav_icon.svg'
import profileIcon from '@public/images/user_profile.svg'
import { useLanguage } from '@hooks/useLanguage'
import axios from '@services/axios'
import { ROUTE_TYPE } from '@lib/config'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import Cookies from 'js-cookie'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { MdOutlineRefresh } from 'react-icons/md'
import { setTradeExecutionProcessed, UserRootState } from '@store/user-slice'
import { testIds } from '@shared/dataTestIds'

interface PendingTrades {
  id: number
  name: string
  quantity: number
  createdAt: string
}

const LockDemand = () => {
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''

  const [items, setItems] = useState<PendingTrades[]>([])
  // const [isLockDemandLoading, setIsLockDemandLoading] = useState<boolean>(false)

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { role } = useSelector((state: RootState) => state.auth)
  const { tradeExecutionProcessed } = useSelector((state: UserRootState) => state.user)

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const fetchPendingTrades = async () => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[role!]}/get-pending-trades`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      const trades = result.map((tr: any) => {
        const {
          id,
          quantity,
          createdAt,
          profile: { name }
        } = tr
        return { id, name, quantity, createdAt }
      })
      setItems(trades)
    } catch (error) {
      console.error('Error fetching pending trade data:', error)
    }
  }

  useEffect(() => {
    fetchPendingTrades()
  }, [])

  const handleOnLockDemand = () => {
    dispatch(setTradeExecutionProcessed(true))

    axios
      .post(
        `${strapiUrl}${ROUTE_TYPE[role!]}/start-trade`,
        {},
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`
          }
        }
      )
      .then(response => {
        console.log('Trade started successfully:', response.data)
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: t.success,
              display: true,
              type: 'success',
              description: response.data.message || t.lockDemandSuccess
            }
          })
        )
        fetchPendingTrades()
      })
      .catch(error => {
        console.error('Error while locking demand:', error)
      })
      .finally(() => {
        dispatch(setTradeExecutionProcessed(false))
      })
  }

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
        profileSection={{
          src: profileIcon,
          handleClick: () => router.push('/profile')
        }}
      />

      <Box
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="calc(0rem + 68px) auto auto auto"
        backgroundColor="white"
        height={'calc(100vh - 92px)'}
      >
        <Flex
          flexDirection={'column'}
          justifyContent={'space-between'}
          height="100%"
        >
          <Box>
            <Typography
              dataTest={testIds.total_aggregated_demand}
              text="Total Aggregated demand"
              fontWeight="600"
              fontSize="16px"
            />

            <Box
              maxH={'calc(100vh - 212px)'}
              overflowY="scroll"
              overflowX="scroll"
              className="hideScroll"
              marginTop={'1rem'}
            >
              <Table
                variant="simple"
                data-test={testIds.total_aggregated_table}
              >
                <Thead
                  data-test={testIds.total_aggregated_table_head}
                  position="sticky"
                  top={0}
                  bg="white"
                  zIndex={1}
                >
                  <Tr data-test={testIds.total_aggregated_table_row}>
                    <Th padding="0">
                      <Box
                        display="flex"
                        alignItems="center"
                        placeContent={'center'}
                        width={'64px'}
                        data-test={testIds.total_aggregated_table_unit}
                      >
                        Unit
                      </Box>
                    </Th>
                    <Th padding="0">
                      <Box
                        display="flex"
                        alignItems="center"
                        placeContent={'center'}
                        width={'130px'}
                        data-test={testIds.total_aggregated_table_consumer}
                      >
                        Consumer
                      </Box>
                    </Th>
                    <Th padding="0">
                      <Box
                        display="flex"
                        alignItems="center"
                        placeContent={'center'}
                        width={'70px'}
                        data-test={testIds.total_aggregated_table_date}
                      >
                        Date
                      </Box>
                    </Th>
                    <Th>
                      <Box
                        display="flex"
                        alignItems="center"
                        width={'5px'}
                      ></Box>
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
                          router.push({ pathname: '/tradeDetails', query: { id: item.id, pagename: item.name } })
                        }}
                      >
                        <Td
                          borderBottom={'1px dotted #004e92!important'}
                          padding="0"
                        >
                          <Typography
                            dataTest={testIds.total_aggregated_item_quantity}
                            text={item.quantity}
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              width: '64px'
                            }}
                          />
                        </Td>
                        <Td
                          borderBottom={'1px dotted #004e92!important'}
                          padding="0"
                        >
                          <Typography
                            dataTest={testIds.total_aggregated_item_name}
                            text={item.name}
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '1',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              width: '130px'
                            }}
                          />
                        </Td>
                        <Td
                          borderBottom={'1px dotted #004e92!important'}
                          padding="0"
                        >
                          <Typography
                            dataTest={testIds.total_aggregated_item_date}
                            text={formatDate(item.createdAt, 'yyyy-MM-dd')}
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              width: '70px'
                            }}
                          />
                        </Td>
                        <Td borderBottom={'1px dotted #004e92!important'}>
                          <Image
                            data-test={testIds.total_aggregated_nav_img}
                            src={NavIcon}
                            alt="nav_icon"
                            width={'6px'}
                          />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5}>
                        <Typography
                          dataTest="noRows"
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
          </Box>
          <BecknButton
            dataTest={testIds.total_aggregated_lock_demand}
            children={'Lock Demand'}
            isLoading={tradeExecutionProcessed}
            handleClick={handleOnLockDemand}
            sx={{ margin: '1rem 0' }}
            disabled={items.length === 0}
          />
        </Flex>
      </Box>
    </>
  )
}

export default LockDemand
