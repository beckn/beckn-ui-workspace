export interface ProductSummaryPropsModel {
  imageSrc: string
  name: string
  itemForRenderer?: any
  ProductSummaryRenderer?: React.ComponentType<{ item: any }>
  className?: string
}
