import { ParsedItem } from '../../pages/search-results/search-results.types'
// TODO :- to change the type once the schema of the new API is defined

export interface ProductCardProps {
  product: ParsedItem
  productInfoDataSource?: Record<string, any>
  ComponentRenderer?: React.ComponentType<{ product: ParsedItem }>
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  className?: string
}

export interface CustomInfoComponentProps {
  product: ParsedItem
}
