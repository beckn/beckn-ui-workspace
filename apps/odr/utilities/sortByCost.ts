import { ParsedScholarshipData } from '../components/productList/ProductList.utils'
import { RetailItem } from '../lib/types/products'

export const sortByExpensive = (product1: ParsedScholarshipData, product2: ParsedScholarshipData): number => {
  return parseFloat(product2.amount.amount) - parseFloat(product1.amount.amount)
}

export const sortByCheapest = (product1: ParsedScholarshipData, product2: ParsedScholarshipData): number => {
  return parseFloat(product1.amount.amount) - parseFloat(product2.amount.amount)
}
