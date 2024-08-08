import { ParsedCabDataModel } from '@utils/cabDetails'

export interface CabServiceDetails {
  rideSearchInProgress: boolean
  cabServiceProviders: ParsedCabDataModel[]
  totalCabs: number
}

export interface CabServiceDetailsRootState {
  cabService: CabServiceDetails
}
