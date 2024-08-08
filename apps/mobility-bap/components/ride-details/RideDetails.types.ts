export interface CabDetailsProps {
  registrationNumber: string
  carModel: string
  color: string
  otp: string
}

export interface DriverDetailsProps {
  driverImage: string
  name: string
  rating: string
}

export interface RideDetailsCardProps {
  registrationNumber: string
  carModel: string
  color: string
  otp: string
  name: string
  rating: string
  onClick: () => void
}

export interface RideDetailsProps {
  registrationNumber: string
  carModel: string
  color: string
  otp: string
  name: string
  rating: string
  fare: string | number
  pickUp: string
  dropOff: string
  cancelRide: () => void
  contactSupport: () => void
}
