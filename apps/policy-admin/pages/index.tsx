import React, { useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { Flex } from '@chakra-ui/react'
import StatusCards from '@components/statusCards/statusCards'
import TabNavPanel from '@components/tabPanel/tabPanel'
import { ItemDetails } from '@lib/types/table'

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
    status: 'inactive',
    startDate: '2024-05-27T09:04:12.974Z',
    endDate: '2024-05-27T09:04:12.974Z'
  },
  {
    title: 'abcdefgh - Whitefield',
    description: '',
    status: 'inactive',
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

  const { t } = useLanguage()

  const getStatusWiseCount = useMemo(() => {
    return {
      active: items.filter(item => item.status === 'active').length,
      inactive: items.filter(item => item.status === 'inactive').length,
      published: items.filter(item => item.status === 'inactpublishedive').length
    }
  }, [items])

  return (
    <>
      <Flex
        flexDirection={'column'}
        width="100%"
      >
        <StatusCards
          active={getStatusWiseCount.active}
          inactive={getStatusWiseCount.inactive}
          published={getStatusWiseCount.published}
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
