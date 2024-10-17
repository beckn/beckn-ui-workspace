import { Typography } from '@beckn-ui/molecules'
import { Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Box } from '@chakra-ui/react'
import DataTable from '@components/dataTable/dataTable'
import React, { useState, useMemo } from 'react'
import addIcon from '@public/images/plus_icon.svg'
import { useRouter } from 'next/router'
import { TabNavPanelProps } from '@lib/types/table'
import { testIds } from '@shared/dataTestIds'

const TabNavPanel = (props: TabNavPanelProps) => {
  const { tabList, items, currentTab, setCurrentTab, meta, fetchData } = props

  const router = useRouter()
  // const filteredItems = useMemo(() => {
  //   return currentTab === 'All' ? items : items.filter(item => item.status.toLowerCase() === currentTab.toLowerCase())
  // }, [items, currentTab])

  return (
    <Tabs
      colorScheme="primary"
      onChange={index => setCurrentTab(tabList[index])}
    >
      <Flex
        flexDirection={'row'}
        justifyContent="space-between"
      >
        <TabList borderBottom={'0px'}>
          {tabList.map((status, index) => (
            <Tab
              key={index}
              m="0px 0px 30px"
              fontSize={{
                base: tabList[index] === currentTab ? '15px' : '14px',
                md: tabList[index] === currentTab ? '15px' : '14px'
              }}
              fontWeight="600"
              p={{ base: '6px 12px', md: '10px 24px' }}
              color={tabList[index] === currentTab ? '#000000' : 'rgba(0, 0, 0, 0.6)'}
              data-test={`tablist_name${status}`}
            >
              {status}
            </Tab>
          ))}
        </TabList>
        <Flex
          position={{ base: 'absolute', md: 'relative' }}
          mt={{ base: '38px', md: 'unset' }}
          right="0"
          flexDirection={'row'}
          alignItems="center"
          mr={{ base: 'unset', md: '1rem' }}
          cursor="pointer"
          onClick={() => {
            router.push('/createPolicy')
          }}
        >
          <Image
            src={addIcon}
            alt="add_icon"
            width={{ base: '1rem', md: '1.5rem' }}
            height={{ base: '1rem', md: '1.5rem' }}
          />
          <Typography
            text="Create New"
            fontSize={'14px'}
            color="#013b76"
            dataTest={testIds.create_new_policy}
          />
        </Flex>
      </Flex>
      <TabPanels>
        {tabList.map((status, index) => (
          <TabPanel
            key={index}
            padding={'unset'}
          >
            <DataTable
              items={items}
              meta={meta}
              currentTab={currentTab}
              fetchData={fetchData}
            />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default TabNavPanel
