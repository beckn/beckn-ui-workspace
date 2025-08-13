import { CatelogRenderMode, Product } from '@beckn-ui/becknified-components'
import { ParsedItemModel } from '../../../lib/types'
import { FilterFieldConfig } from '../filter/filter.types'

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
    handleFilterOpen: () => void
    handleFilterClose: () => void
    handleResetFilter: () => void
    handleApplyFilter: (filters: Record<string, string>) => void
    fields?: FilterFieldConfig[]
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
