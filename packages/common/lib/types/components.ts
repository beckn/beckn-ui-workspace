import { Product } from '@beckn-ui/becknified-components'
import { Logos } from './auth'
import { ParsedItemModel } from './beckn'

// translate language props
export interface TranslationProps {
  t: (key: string) => string
  locale?: string
}

// top-sheet component props
export interface TopSheetComponentProps extends TranslationProps {
  currentAddress: string
  loadingForCurrentAddress?: boolean
  currentLocationFetchError?: string
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
    poweredByLogoSrc: string
    poweredByText: string
  }
}

// powered by component props
export interface PoweredByProps {
  logoSrc: string
  altText?: string
  poweredByText: string
}

// search component props
export interface SearchAndDiscoverProps {
  items: ParsedItemModel[]
  searchProps: {
    searchKeyword: string
    setSearchKeyword: (value: string) => void
    fetchDataOnSearch: () => void
  }
  filterProps?: {
    isFilterOpen: boolean
    handleFilterOpen: () => void
    handleFilterClose: () => void
    handleResetFilter: () => void
    handleApplyFilter: (value: string) => void
  }
  loaderProps: {
    isLoading: boolean
    loadingSubText: string
    loadingText: string
  }
  catalogProps: {
    viewDetailsClickHandler: (item: ParsedItemModel, product: Product) => void
  }
}

export interface SearchBarProps {
  searchString: string | string[] | undefined
  handleChange: Function
  placeholder?: string
}

export interface QrCodeProps {
  value: string
}

export interface HeaderProps extends TranslationProps {
  handleMenuClick?: () => void
}

export interface SubHeaderProps extends TranslationProps {
  showCartIcon?: boolean
}
