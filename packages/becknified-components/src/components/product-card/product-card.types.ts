// TODO :- to change the type once the schema of the new API is defined

import { CurrencyType } from '../types'

export interface Product {
  images: string[]
  name: string
  price: string
  rateLabel?: string
  id: string
  rating?: string
  currencyType?: CurrencyType
  shortDesc?: string
  source?: string
  sourceText?: string
  productInfo?: Record<string, any>
}

export interface ProductCardProps {
  dataSource?: any
  product?: Product
  productInfoDataSource?: Record<string, any>
  ComponentRenderer?: any
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  className?: string
  currency?: CurrencyType
  dataTest?: string
}

export interface CustomInfoComponentProps {
  dataSource: any
}
