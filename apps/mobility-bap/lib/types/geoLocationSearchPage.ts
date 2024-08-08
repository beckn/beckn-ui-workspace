import { PickUpDropOffModel } from '@beckn-ui/common'

export interface IGeoLocationSearchPage {
  geoLocationSearchPageVisible: boolean
  // geoAddre??ss: string
  pickup: PickUpDropOffModel
  dropoff: PickUpDropOffModel
}

export interface IGeoLocationSearchPageRootState {
  geoLocationSearchPageUI: IGeoLocationSearchPage
}
