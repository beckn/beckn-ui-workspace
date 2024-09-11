import { MetaData } from '@pages/index'

export interface ItemDetails {
  name: string
  description: string
  status: string
  startDate: string
  endDate: string
}

export interface TabNavPanelProps {
  currentTab: string
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
  meta: MetaData
  tabList: string[]
  items: ItemDetails[]
  fetchData: (pageNumber: number) => void
}

export interface DataTableProps {
  items: ItemDetails[]
  meta: MetaData
  currentTab: string
  fetchData: (pageNumber: number) => void
}
