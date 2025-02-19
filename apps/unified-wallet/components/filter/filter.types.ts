export interface FilterPropsModel {
  sortByRating?: boolean
  handleApplyFilter: (sortBy: string) => void
  handleResetFilter: () => void
  handleCancelFilter?: () => void
}
