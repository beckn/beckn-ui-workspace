export interface IGeoLocationSearchPage {
    geoLocationSearchPageVisible: boolean
    geoAddress: string
    geoLatLong: string
}

export interface IGeoLocationSearchPageRootState {
    geoLocationSearchPageUI: IGeoLocationSearchPage
}
