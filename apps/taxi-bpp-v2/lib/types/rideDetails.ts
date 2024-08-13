import { Coordinate } from '@beckn-ui/common'
import { ButtonProps } from '@beckn-ui/molecules'
import { RIDE_STATUS_CODE } from '@utils/ride-utils'

export interface CurrentRideRequest {
  orderId: string
  source: string
  destination: string
  distance?: string
  time?: string
  date?: string
  driverStatus?: RIDE_STATUS_CODE
  cost?: string
}

export interface RideSummaryHeaderProps {
  driverImg?: string
  title?: string
  subTitle?: string
}
export interface RideSummaryProps extends CurrentRideRequest {
  buttons: ButtonProps[]
  fare?: {
    text: string
    cost: string
  }
  handleNavigate?: (data: Coordinate, showRoute?: boolean) => void
  sourceGps?: Coordinate
  destinationGps?: Coordinate
}

export interface RideDetailsProps {
  img: string
  riderName: string
  date: string
  time: string
  fare: string
  status: string
}
