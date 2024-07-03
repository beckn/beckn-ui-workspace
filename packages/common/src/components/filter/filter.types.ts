export interface FilterPropsModel {
  handleApplyFilter: (sortBy: string) => void
  handleResetFilter: () => void
  handleCancelFilter?: () => void
}
