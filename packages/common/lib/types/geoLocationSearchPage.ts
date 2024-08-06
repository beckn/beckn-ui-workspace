import { Coordinate } from './common'

export interface PickUpDropOffModel {
  address: string
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
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
