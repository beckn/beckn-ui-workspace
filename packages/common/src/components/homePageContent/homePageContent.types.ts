import { Logos } from '../../../lib/types'

export interface HomePageContentProps {
  blockOrder?: string[]
  logos?: Logos
  headerProps?: {
    name: string
    title?: string
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
    poweredByLogoSrc: string
    poweredByText: string
  }
}
