import { MetaData } from '@pages/index'

export interface ItemDetails {
  id: string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null | undefined
  policyId: string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null | undefined
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
  fetchData: (pageNumber: number, sortBy: any) => void
}

export interface DataTableProps {
  items: ItemDetails[]
  meta: MetaData
  currentTab: string
  fetchData: (pageNumber: number, sortBy?: any) => void
}
