export interface ProductSummaryPropsModel {
  imageSrc: string
  name: string
  desc?: string
  itemForRenderer?: any
  ProductSummaryRenderer?: React.ComponentType<{ item: any }>
  className?: string
}
