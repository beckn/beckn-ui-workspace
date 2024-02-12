import { RetailItem } from './products'
export interface IFavorite {
    items: RetailItem[]
}

export interface IFavoriteRootState {
    favorite: IFavorite
}
