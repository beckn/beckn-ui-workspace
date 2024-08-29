import { Logos } from '../../../lib/types'

export type BlockName =
  | 'header'
  | 'description'
  | 'selectInput'
  | 'searchInput'
  | 'searchByLocation'
  | 'geoLocationInput'
export interface HomePageContentProps {
  blockOrder?: BlockName[]
  logos?: Logos
  headerProps?: {
    name: string
    title?: string
    description: string
  }
  searchProps?: {
    searchPlaceholder: string
    label?: string
    setSearchTerm: (value: string) => void
    onSearchIconClick: (e: React.MouseEvent) => void
    onSearchInputEnterPress: () => void
  }
  selectInputProps?: {
    items: string[]
    selectedItem: string
    isOpen: boolean
    toggleDropdown: () => void
    handleItemClick: (item: string) => void
  }
  searchByLocation?: {
    label: string
    onSearchByLocationClick: (e: React.MouseEvent) => void
  }
  geoLocationInput?: {
    placeholder: string
    geoLocationSearchPageSelectedAddress: string
    navigateToSearchResult: () => void
  }
  footerProps: {
    poweredByLogoSrc: string
    poweredByText: string
  }
}
