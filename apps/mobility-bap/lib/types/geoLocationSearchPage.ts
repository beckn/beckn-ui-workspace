export interface GeoLocationAddresModel {
  address: string
  geoLatLong: {
    lat: number
    long: number
  }
}
export interface IGeoLocationSearchPage {
  geoLocationSearchPageVisible: boolean
  // geoAddre??ss: string
  pickup: GeoLocationAddresModel
  dropoff: GeoLocationAddresModel
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
