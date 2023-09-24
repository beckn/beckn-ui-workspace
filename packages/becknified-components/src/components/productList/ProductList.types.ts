import { ParsedItem } from '../../pages/searchResults/searchResults.types'

export interface ProductListProps {
  productList: ParsedItem[]
  productInfoDataSource?: Record<string, any>
  CustomInfoComponentForProductCard?: React.ComponentType<{ product: ParsedItem }>
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
}
