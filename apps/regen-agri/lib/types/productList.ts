import { RetailItem } from './products'

export interface IProductList {
    productsList: RetailItem[] | []
}

export interface IProductListRootState {
    sortedProductsList: IProductList
}
