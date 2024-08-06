import { ButtonProps, TypographyProps } from '@beckn-ui/molecules'
import { StarRatingProps, ProductPriceProps, ProductCtaProps } from '@beckn-ui/becknified-components'

export interface ProductSummaryPropsModel {
  imageSrc: string
  name: string
  itemForRenderer?: any
  ProductSummaryRenderer?: any
  className?: string
  secondaryDescription?: string
  secondaryCTAs?: ButtonProps[]
  starRating?: StarRatingProps
  productCta?: ProductCtaProps
  dataTestTitle?: string
  dataTestDescription?: string
}
