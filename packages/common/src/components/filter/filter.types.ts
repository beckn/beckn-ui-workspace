export interface FilterFieldConfig {
  name: string
  label: string
  type: 'dropdown' | 'text' | 'number' | 'date'
  options?: Array<{
    value: string
    label: string
    isDisabled?: boolean
  }>
  defaultValue?: string
  isRequired?: boolean
}

export interface FilterPropsModel {
  sortByRating?: boolean
  handleApplyFilter: (filters: Record<string, string>) => void
  handleResetFilter: () => void
  handleCancelFilter?: () => void
  fields?: FilterFieldConfig[]
}
