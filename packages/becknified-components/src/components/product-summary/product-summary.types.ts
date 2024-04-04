import { ButtonProps, TypographyProps } from '@beckn-ui/molecules'
import { StarRatingProps, ProductPriceProps } from '@beckn-ui/becknified-components'

export interface ProductSummaryPropsModel {
  imageSrc: string
  name: string
  itemForRenderer?: any
  ProductSummaryRenderer?: React.ComponentType<{ item: any }>
  className?: string
  secondaryDescription?: string
  secondaryCTAs?: ButtonProps[]
  starRating?: StarRatingProps
}

export interface ProductSummaryBoxProps {
  title: TypographyProps
  productPrice: ProductPriceProps
  button: ButtonProps
  counter: number
  incrementCounter: () => void
  decrementCounter: () => void
}
