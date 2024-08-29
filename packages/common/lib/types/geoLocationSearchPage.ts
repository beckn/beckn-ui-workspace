import { Coordinate } from './common'

export interface PickUpDropOffModel {
  address: string
  country?: string
  geoLocation: Coordinate
}

export type GeoLocationType = '' | 'pick-up' | 'drop-off'
export interface IGeoLocationSearchPage {
  geoLocationSearchPageVisible: boolean
  currentGeoLocationType: GeoLocationType
  geoAddress: string
  geoLatLong: string
  destinationGeoAddress: string
  destinationGeoLatLong: string
  country: string
  destinationCountry: string
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
