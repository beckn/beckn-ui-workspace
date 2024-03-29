export interface IGeoLocationSearchPage {
  geoLocationSearchPageVisible: boolean
  // geoAddre??ss: string
  geoLatLong: string
  pickupAddress: string
  dropoffAddress: string
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
