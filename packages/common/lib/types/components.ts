import { Logos } from './auth'

// top-sheet component props
export interface TopSheetComponentProps {
  currentAddress: string
  loadingForCurrentAddress?: boolean
  currentLocationFetchError?: string
  t: (key: string) => string
  searchPlaceholder?: string
}

// home-page component props
export interface HomePageContentProps {
  blockOrder?: string[]
  logos?: Logos
  headerProps?: {
    name: string
    title: string
    description: string
  }
  searchProps: {
    searchPlaceholder: string
    setSearchTerm: (value: string) => void
    onSearchIconClick: (e: React.MouseEvent) => void
    onSearchInputEnterPress: () => void
  }
  searchByLocation?: {
    label: string
    onSearchByLocationClick: (e: React.MouseEvent) => void
  }
  footerProps: {
    footerLogoSrc: string
    footerText: string
  }
}
