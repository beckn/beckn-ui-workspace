import { ButtonProps, TypographyProps } from '@beckn-ui/molecules'
import { StarRatingProps, ProductPriceProps, ProductCtaProps } from '@beckn-ui/becknified-components'

export interface ProductSummaryPropsModel {
  imageSrc: string
  name: string
  providerName?: string
  itemForRenderer?: any
  ProductSummaryRenderer?: any
  className?: string
  secondaryDescription?: string
  secondaryCTAs?: ButtonProps[]
  starRating?: StarRatingProps
  productCta?: ProductCtaProps
  dataTestTitle?: string
  dataTestDescription?: string
  domain?: string
  showPriceInSummary?: boolean
}
