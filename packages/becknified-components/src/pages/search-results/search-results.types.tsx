import { Product } from '../../components/product-card/product-card.types'
import { LoaderProps } from '@beckn-ui/molecules'

export interface SearchResultsProps {
  schema: {
    productList: Product[]
    productCard: {
      productClickHandler?: React.MouseEventHandler<HTMLDivElement>
      productCardRenderer?: React.ComponentType<{ product: Product }>
      productInfoDataSource?: Record<string, any>
    }
    loader: LoaderProps
  }
  isLoading?: boolean
}
