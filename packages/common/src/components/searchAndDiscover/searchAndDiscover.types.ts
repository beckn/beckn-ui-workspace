import { CatelogRenderMode, Product } from '@beckn-ui/becknified-components'
import { ParsedItemModel, SearchResponseModel } from '../../../lib/types'

export interface SearchAndDiscoverProps {
  items: ParsedItemModel[]
  searchProps: {
    searchKeyword: string
    selectedInput?: string
    placeholder?: string
    showSearchField?: boolean
    setSearchKeyword: (value: string) => void
    fetchDataOnSearch: () => void
  }
  filterProps?: {
    showFilterField?: boolean
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
    image?: string
  }
  catalogProps: {
    renderMode?: CatelogRenderMode
    viewDetailsClickHandler: (item: ParsedItemModel, product: Product) => void
  }
  t?: (key: string) => string
  noProduct: (key: string) => string
}
