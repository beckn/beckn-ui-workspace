export interface SearchBarPropsModel {
  searchString: string | string[] | undefined
  handleChange: Function
}

export interface Location {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: number
  lon: number
  category: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  boundingbox: string[]
}
type StoreTags = {
  image?: string
  images?: string
  name?: string
  'addr:full'?: string
  'addr:street'?: string
}

export type SelectedStore = {
  tags: StoreTags
}
