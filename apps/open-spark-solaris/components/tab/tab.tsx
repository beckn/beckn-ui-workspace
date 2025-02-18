import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { ROLE } from '@lib/config'
import React from 'react'

interface TabViewProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  list: string[]
  TabContent: JSX.Element
}

const TabView = (props: TabViewProps) => {
  const { currentTab, list, setCurrentTab, TabContent } = props

  return (
    <Tabs
      variant="soft-rounded"
      colorScheme="primary"
      onChange={index => setCurrentTab(list[index])}
    >
      <TabList>
        {list.map((name, index) => (
          <Tab
            key={index}
            m="0px 0px 0px"
            fontSize={'14px'}
            fontWeight="600"
            p={'10px 24px'}
            color={list[index] === currentTab ? '#4498E8 !important' : '#000000 !important'}
            background={'transparent !important'}
            borderBottom={
              list[index] === currentTab ? '2px solid #4498E8 !important' : '0.5px solid #d3d9e1 !important'
            }
            borderRadius={'0 !important'}
            width={'100%'}
            data-test={`testIds.tablist_name_${name}`}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {list.map((status, index) => (
          <TabPanel
            key={index}
            padding={'unset'}
          >
            {TabContent}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default TabView
