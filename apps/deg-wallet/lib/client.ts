import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

//connect to sanity
export const client = sanityClient({
  projectId: '3c4n15ly',
  dataset: 'production',
  apiVersion: '2022-06-04',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

//be able to use sanity images
const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)

export const statusMap = {
  IN_PROGRESS: 'Processing your order',
  PaymentSettled: 'Ready to ship',
  Cancelled: 'Order Cancelled!',
  Shipped: 'Order Shipped',
  ORDER_DELIVERED: 'Order Delivered',
  CHARGING_IN_PROGRESS: 'Charging in Progress',
  CHARGING_COMPLETED: 'Charging Completed'
}

export type StatusMap = typeof statusMap
export type StatusKey = keyof StatusMap

export const ParentStatusMap = {
  ACTIVE: 'In Progress',
  COMPLETE: 'Completed',
  CANCELLED: 'Cancelled'
}

export type ParentStatusMap = typeof ParentStatusMap
export type ParentStatusKey = keyof ParentStatusMap
