import { Product } from '../product-card/product-card.types'

// TODO :- will have to chekc the type when the generic client layer is built

export interface ProductListProps {
  productList: Product[]
  productInfoDataSource?: Record<string, any>
  CustomInfoComponentForProductCard?: React.ComponentType<{ dataSource: any }>
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
}
