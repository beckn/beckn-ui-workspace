import { Typography } from '@beckn-ui/molecules'
import { Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import DataTable from '@components/dataTable/dataTable'
import React, { useState, useMemo } from 'react'
import addIcon from '@public/images/plus_icon.svg'
import { useRouter } from 'next/router'

export interface ItemDetails {
  title: string
  description: string
  status: string
  startDate: string
  endDate: string
}

export interface DataTableProps {
  items: ItemDetails[]
}

const tabList = ['All', 'Active', 'Inactive', 'Published']

const TabNavPanel = (props: DataTableProps) => {
  const { items } = props
  const [currentTab, setCurrentTab] = useState<string>('All')

  const router = useRouter()
  const filteredItems = useMemo(() => {
    return currentTab === 'All' ? items : items.filter(item => item.status.toLowerCase() === currentTab.toLowerCase())
  }, [items, currentTab])

  return (
    <Tabs
      colorScheme="primary"
      onChange={index => setCurrentTab(tabList[index])}
    >
      <Flex
        flexDirection={'row'}
        justifyContent="space-between"
      >
        <TabList>
          {tabList.map((status, index) => (
            <Tab
              key={index}
              m="0px 0px 24px"
              fontSize={tabList[index] === currentTab ? '15px' : '14px'}
              fontWeight="600"
              p={'10px 24px'}
              color={tabList[index] === currentTab ? '#000000' : 'rgba(0, 0, 0, 0.6)'}
            >
              {status}
            </Tab>
          ))}
        </TabList>
        <Flex
          flexDirection={'row'}
          alignItems="center"
          mr="1rem"
          cursor="pointer"
          onClick={() => {
            router.push('/createPolicy')
          }}
        >
          <Image
            src={addIcon}
            alt="add_icon"
            width={'1.5rem'}
            height={'1.5rem'}
          />
          <Typography
            text="Create New"
            fontSize="14px"
            color="#013b76"
          />
        </Flex>
      </Flex>
      <TabPanels>
        {tabList.map((status, index) => (
          <TabPanel
            key={index}
            padding={'unset'}
          >
            <DataTable items={filteredItems} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default TabNavPanel
