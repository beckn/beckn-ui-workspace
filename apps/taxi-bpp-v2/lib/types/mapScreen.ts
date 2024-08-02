import { Coordinate } from '@beckn-ui/common'
import { ButtonProps } from '@beckn-ui/molecules'

export interface RideDetailsModel {
  time?: string
  date?: string
  handleNavigate?: (data: Coordinate) => void
  distance?: string
  source: string
  destination?: string
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

export type ModalTypes = 'REQ_NEW_RIDE' | 'PICK_UP' | 'REACHED_PICK_UP' | 'START_RIDE' | 'COMPLETED'
