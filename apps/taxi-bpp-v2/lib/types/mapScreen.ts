import { ButtonProps } from '@beckn-ui/molecules'

export interface RideDetailsModel {
  time: string
  distance: string
  source: string
  destination: string
}

export interface ModalDetails {
  id: ModalTypes
  title: string
  subTitle: string
  rideDetails: RideDetailsModel
  buttons: ButtonProps[]
}

export type ModalTypes = 'REQ_NEW_RIDE' | 'PICK_UP' | 'RIDE_STARTED' | 'COMPLETED' | 'END'
