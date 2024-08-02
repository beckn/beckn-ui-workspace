import { ButtonProps } from '@beckn-ui/molecules'

export interface RideDetailsModel {
  time: string
  date?: string
  handleNavigate: React.MouseEventHandler<HTMLDivElement>
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
  fare?: {
    text: string
    cost: string
  }
}

export type ModalTypes = 'REQ_NEW_RIDE' | 'PICK_UP' | 'RIDE_STARTED' | 'COMPLETED' | 'END'
