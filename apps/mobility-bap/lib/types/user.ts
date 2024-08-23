import { PickUpDropOffModel } from '@beckn-ui/common'

export interface UserGeoLocation {
  pickup: PickUpDropOffModel
  dropoff: PickUpDropOffModel
}

export interface UserGeoLocationRootState {
  userInfo: UserGeoLocation
}
