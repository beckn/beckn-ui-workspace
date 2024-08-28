import { PickUpDropOffModel } from '@beckn-ui/common'

export interface CabDetailsProps {
  registrationNumber: string
  carModel: string
  color?: string
  otp?: string
}

export interface DriverDetailsProps {
  driverImage: string
  name: string
  rating: string
  contact: string
}

export interface RideDetailsCardProps {
  registrationNumber: string
  carModel: string
  color?: string
  otp?: string
  name: string
  rating: string
  contact: string
  cancelRide: () => void
  contactSupport: () => void
}

export interface RideDetailsProps {
  registrationNumber: string
  carModel: string
  color: string
  otp: string
  name: string
  rating: string
  fare: string | number
  contact: string
  pickUp: PickUpDropOffModel
  dropOff: PickUpDropOffModel
  contactSupport: () => void
  handleEditDropoff: () => void
}
