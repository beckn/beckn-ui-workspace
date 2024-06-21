// TODO :- to change the type once the schema of the new API is defined

import { CurrencyType } from '../types'

export interface Product {
  images: string[]
  name: string
  price: string
  id: string
  rating?: string
  currencyType?: CurrencyType
  shortDesc?: string
  source?: string
  sourceText?: string
}

export interface ProductCardProps {
  dataSource?: any
  product?: Product
  productInfoDataSource?: Record<string, any>
  ComponentRenderer?: any
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  className?: string
  currency?: CurrencyType
}

export interface CustomInfoComponentProps {
  dataSource: any
}
