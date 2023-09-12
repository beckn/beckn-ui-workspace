export interface SearchInputOnSearchResultsPageProps {
  handleSubmit: () => void
  searchText: string
  setSearchText: React.Dispatch<React.SetStateAction<string>>
}
