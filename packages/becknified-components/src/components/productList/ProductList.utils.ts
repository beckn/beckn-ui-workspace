import { ParsedItem } from '../../pages/searchResults/searchResults.types'

export const sortByExpensive = (product1: ParsedItem, product2: ParsedItem): number => {
  return parseFloat(product2.price.value) - parseFloat(product1.price.value)
}

export const sortByCheapest = (product1: ParsedItem, product2: ParsedItem): number => {
  return parseFloat(product1.price.value) - parseFloat(product2.price.value)
}
