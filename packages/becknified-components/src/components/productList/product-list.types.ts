import { ParsedItem } from '../../pages/search-results/search-results.types'

// TODO :- will have to chekc the type when the generic client layer is built

export interface ProductListProps {
  productList: ParsedItem[]
  productInfoDataSource?: Record<string, any>
  CustomInfoComponentForProductCard?: React.ComponentType<{ product: ParsedItem }>
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
}
