import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { Flex } from '@chakra-ui/react'
import StatusCards from '@components/statusCards/statusCards'
import TabNavPanel from '@components/tabPanel/tabPanel'
import { ItemDetails } from '@lib/types/table'
import { useDashboardMutation } from '@services/PolicyService'
import { useDispatch } from 'react-redux'
import { feedbackActions } from '@beckn-ui/common'

export interface StatusCardRootProps {
  active: number
  inactive: number
  published: number
}

const tabList = ['All', 'Active', 'Inactive', 'Published']

const data = [
  {
    title: 'Disruption of Traffic - BTM Layout',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'Traffic Advisory - Whitefield',
    description: '',
    status: 'published',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'Disruption - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'abcdefgh - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'Pqr - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'Xyz Abc - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'Advisory - Whitefield',
    description: '',
    status: 'new',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'Traffic Alert - Whitefield',
    description: '',
    status: 'new',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'High Traffic Advisory - Whitefield',
    description: '',
    status: 'active',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  }
]

const Homepage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [items, setItems] = useState<ItemDetails[]>(data)
  const [statusCount, setStatusCount] = useState<StatusCardRootProps>({
    active: 0,
    inactive: 0,
    published: 0
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [dashboard] = useDashboardMutation()

  const getDashboardStatusCount = async () => {
    try {
      setIsLoading(true)
      const response = await dashboard({}).unwrap()
      setStatusCount(response)
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
  }

  useEffect(() => {
    getDashboardStatusCount()
  }, [])

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
          items={items}
        />
      </Flex>
    </>
  )
}

export default Homepage
