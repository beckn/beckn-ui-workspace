export interface IGeoLocationSearchPage {
  geoLocationSearchPageVisible: boolean
  // geoAddre??ss: string
  geoLatLong: {
    lat: number
    long: number
  }
  pickupAddress: string
  dropoffAddress: string
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
