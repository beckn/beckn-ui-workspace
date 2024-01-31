import { ButtonProps } from '@beckn-ui/molecules'
import { ProductSummaryPropsModel } from '../../components/product-summary/product-summary.types'
import { ProductDescriptionPropModel } from '../../components/prouct-description/product-description.types'

export interface ProductDetailsPagePropsModel {
  schema: {
    productSummary: ProductSummaryPropsModel
    productDescription: ProductDescriptionPropModel
    buttons: ButtonProps[]
  }
}
