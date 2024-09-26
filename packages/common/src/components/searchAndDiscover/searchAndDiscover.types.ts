import { Product } from '@beckn-ui/becknified-components'
import { ParsedItemModel } from '../../../lib/types'

export interface SearchAndDiscoverProps {
  items: ParsedItemModel[]
  searchProps: {
    searchKeyword: string
    selectedInput?: string
    placeholder?: string
    setSearchKeyword: (value: string) => void
    fetchDataOnSearch: () => void
  }
  filterProps?: {
    isFilterOpen: boolean
    sortByRating?: boolean
    handleFilterOpen: () => void
    handleFilterClose: () => void
    handleResetFilter: () => void
    handleApplyFilter: (value: string) => void
  }
  loaderProps: {
    isLoading: boolean
    loadingSubText: string
    loadingText: string
    dataTest?: string
  }
  catalogProps: {
    viewDetailsClickHandler: (item: ParsedItemModel, product: Product) => void
  }

  noProduct: (key: string) => string
}
