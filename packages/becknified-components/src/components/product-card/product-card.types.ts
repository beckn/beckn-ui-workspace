// TODO :- to change the type once the schema of the new API is defined

import { CurrencyType } from '../types'

export type CatelogRenderMode = 'full' | 'short'
export interface Product {
  providerImg?: any
  images: string[]
  name: string
  price: string
  rateLabel?: string
  id: string
  domain?: string | Record<string, any>
  rating?: string
  currencyType?: CurrencyType
  shortDesc?: string
  source?: string
  sourceText?: string
  productInfo?: Record<string, any> | string
  guideImage?: string | any
  domainCategory?: string
}

export interface ProductCardProps {
  dataSource?: any
  product?: Product
  productInfoDataSource?: Record<string, any> | string
  ComponentRenderer?: any
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  className?: string
  currency?: CurrencyType
  dataTest?: string
  renderMode?: CatelogRenderMode
}

export interface CustomInfoComponentProps {
  dataSource: any
}
