import { Product } from '../product-card/product-card.types'

// TODO :- Have to check the type once the type is defined from the generic CL

export const sortByExpensive = (product1: Product, product2: Product): number => {
  return parseFloat(product2.price) - parseFloat(product1.price)
}

export const sortByCheapest = (product1: Product, product2: Product): number => {
  return parseFloat(product1.price) - parseFloat(product2.price)
}
