import { Logos } from '../../../lib/types'

export interface CardType {
  id: number
  type: 'course' | 'scholarship' | 'jobs'
  image: {
    white: string
    black: string
  }
  text: string
}
export type BlockName =
  | 'header'
  | 'description'
  | 'selectInput'
  | 'searchInput'
  | 'searchByLocation'
  | 'geoLocationInput'
  | 'cardType'
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
  CardSelector?: {
    imageCardList: CardType[]
    handleClick: (type: string) => void
    activeCard: string
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
