export interface ItemDetails {
  title: string
  description: string
  status: string
  startDate: string
  endDate: string
}

export interface TabNavPanelProps {
  tabList: string[]
  items: ItemDetails[]
}

export interface DataTableProps {
  items: ItemDetails[]
}
