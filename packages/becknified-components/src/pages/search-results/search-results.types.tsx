import { Product } from '../../components/product-card/product-card.types'

export interface SearchResultsProps {
  schema: {
    productList: Product[]
    productCard: {
      productClickHandler?: React.MouseEventHandler<HTMLDivElement>
      productCardRenderer?: React.ComponentType<{ product: Product }>
      productInfoDataSource?: Record<string, any>
    }
  }
}
