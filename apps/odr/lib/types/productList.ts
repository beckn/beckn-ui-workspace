import { ParsedScholarshipData } from '../../components/productList/ProductList.utils'
import { RetailItem } from './products'

export interface IProductList {
  productsList: ParsedScholarshipData[] | []
}

export interface IProductListRootState {
  sortedProductsList: IProductList
}
