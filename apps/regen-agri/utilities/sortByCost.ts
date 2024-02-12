import { RetailItem } from '../lib/types/products'

export const sortByExpensive = (
    product1: RetailItem,
    product2: RetailItem
): number => {
    return parseFloat(product2.price.value) - parseFloat(product1.price.value)
}

export const sortByCheapest = (
    product1: RetailItem,
    product2: RetailItem
): number => {
    return parseFloat(product1.price.value) - parseFloat(product2.price.value)
}
