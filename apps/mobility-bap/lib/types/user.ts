import { PickUpDropOffModel } from '@beckn-ui/common'

export interface UserGeoLocation {
  experienceType: string
  pickup: PickUpDropOffModel
  dropoff: PickUpDropOffModel
}

export interface UserGeoLocationRootState {
  userInfo: UserGeoLocation
}
