// TODO :- to change the type once the schema of the new API is defined

export interface Product {
  images: string[]
  name: string
  price: string
  id: string
  rating?: string
}

export interface ProductCardProps {
  product: Product
  productInfoDataSource?: Record<string, any>
  ComponentRenderer?: React.ComponentType<{ product: Product }>
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  className?: string
}

export interface CustomInfoComponentProps {
  product: Product
}
