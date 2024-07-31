export interface IGeoLocationSearchPage {
  geoLocationSearchPageVisible: boolean
  geoAddress: string
  geoLatLong: string
  pickupAddress?: string
  dropoffAddress?: string
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
