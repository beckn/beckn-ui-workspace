import { Coordinate } from '@beckn-ui/common'
import { CurrentRideRequest } from './rideDetails'

export interface RideDetailsModel extends CurrentRideRequest {
  sourceGeoLocation?: Coordinate
  destinationGeoLocation?: Coordinate
}

export interface ModalDetails {
  id: ModalTypes
  title: string
  subTitle: string
  dataTest: string
  rideDetails: RideDetailsModel
  fare?: {
    text: string
    cost: string
  }
}

export type ModalTypes = 'REQ_NEW_RIDE' | 'GOING_FOR_PICK_UP' | 'REACHED_PICK_UP' | 'START_RIDE' | 'COMPLETED'
