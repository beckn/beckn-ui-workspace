import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { Flex } from '@chakra-ui/react'
import StatusCards from '@components/statusCards/statusCards'
import TabNavPanel from '@components/tabPanel/tabPanel'
import { ItemDetails } from '@lib/types/table'
import { useDashboardMutation, useGetAllPoliciesMutation } from '@services/PolicyService'
import { useDispatch } from 'react-redux'
import { feedbackActions } from '@beckn-ui/common'

export interface StatusCardRootProps {
  active: number
  inactive: number
  published: number
}

export interface MetaData {
  start: number
  limit: number
  total: number
}

const tabList = ['All', 'Active', 'Inactive', 'Published']

const data = [
  {
    title: 'Disruption of Traffic - BTM Layout',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  }
]

const Homepage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<string>('All')
  const [items, setItems] = useState<ItemDetails[]>([])
  const [meta, setMeta] = useState<MetaData>({
    start: 0,
    limit: 10,
    total: 0
  })
  const [statusCount, setStatusCount] = useState<StatusCardRootProps>({
    active: 0,
    inactive: 0,
    published: 0
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [dashboard] = useDashboardMutation()
  const [getAllPolicies] = useGetAllPoliciesMutation()

  const getDashboardData = useCallback(
    async (pageNumber: number = 1) => {
      try {
        let getPoliciesPayload: Record<string, number | string> = {
          start: (pageNumber - 1) * 10,
          limit: 10
        }

        if (['Active', 'Inactive', 'Published'].includes(currentTab)) {
          getPoliciesPayload.status = currentTab.toLowerCase()
        }

        setIsLoading(true)
        const response = await Promise.all([dashboard({}).unwrap(), getAllPolicies(getPoliciesPayload).unwrap()])
        if (response.length > 0) {
          setStatusCount(response[0])
          setItems(response[1].policies)
          setMeta(response[1].meta)
        }
      } catch (error) {
        console.error('An error occurred while dashboard details:', error)
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Error',
              display: true,
              type: 'error',
              description: 'Failed to fetch policy status!'
            }
          })
        )
      } finally {
        setIsLoading(false)
      }
    },
    [currentTab]
  )

  useEffect(() => {
    getDashboardData()
  }, [currentTab])

  return (
    <>
      <Flex
        flexDirection={'column'}
        width="100%"
      >
        <StatusCards
          active={statusCount.active}
          inactive={statusCount.inactive}
          published={statusCount.published}
        />
        <TabNavPanel
          tabList={tabList}
          currentTab={currentTab}
          meta={meta!}
          setCurrentTab={setCurrentTab}
          items={items}
          fetchData={getDashboardData}
        />
      </Flex>
    </>
  )
}

export default Homepage
