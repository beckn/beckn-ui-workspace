import { Coordinate } from '@beckn-ui/common'
import { ButtonProps } from '@beckn-ui/molecules'
import { CurrentRideRequest } from './rideDetails'

export interface RideDetailsModel extends CurrentRideRequest {
  handleNavigate?: (data: Coordinate) => void
  sourceGeoLocation?: Coordinate
  destinationGeoLocation?: Coordinate
}

export interface ModalDetails {
  id: ModalTypes
  title: string
  subTitle: string
  rideDetails: RideDetailsModel
  buttons: ButtonProps[]
  fare?: {
    text: string
    cost: string
  }
}

export type ModalTypes = 'REQ_NEW_RIDE' | 'GOING_FOR_PICK_UP' | 'REACHED_PICK_UP' | 'START_RIDE' | 'COMPLETED'
