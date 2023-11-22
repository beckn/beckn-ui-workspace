import { ParsedItem } from '../../pages/search-results/search-results.types'

// TODO :- Have to check the type once the type is defined from the generic CL

export const sortByExpensive = (product1: ParsedItem, product2: ParsedItem): number => {
  return parseFloat(product2.price.value) - parseFloat(product1.price.value)
}

export const sortByCheapest = (product1: ParsedItem, product2: ParsedItem): number => {
  return parseFloat(product1.price.value) - parseFloat(product2.price.value)
}
