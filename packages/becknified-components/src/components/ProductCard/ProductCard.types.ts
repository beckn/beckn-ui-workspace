import { ParsedItem } from '../../pages/searchResults/searchResults.types'

export interface ProductCardProps {
  product: ParsedItem
  productInfoDataSource?: Record<string, any>
  CustomInfoComponent?: React.ComponentType<{ product: ParsedItem }>
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  className?: string
}

export interface CustomInfoComponentProps {
  product: ParsedItem
}
