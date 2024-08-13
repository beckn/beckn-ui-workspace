import { ParsedCabDataModel } from '@utils/cabDetails'
import { CancelTokenSource } from 'axios'

export interface CabServiceDetails {
  cancelTokenSource: CancelTokenSource | null
  rideSearchInProgress: boolean
  cabServiceProviders: ParsedCabDataModel[]
  totalCabs: number
}

export interface CabServiceDetailsRootState {
  cabService: CabServiceDetails
}

export interface RideDetailsProps {
  name: string
  registrationNumber: string
  carModel: string
  rating: string
  contact: string
  price?: string
}
