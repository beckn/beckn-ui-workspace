import { Product } from '@beckn-ui/becknified-components'
import { ParsedItemModel } from '../../../lib/types'

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
