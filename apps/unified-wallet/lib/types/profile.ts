export interface UserDetailsModel {
  email: string
  username: string
  name: string
  description?: string
  phoneNumber: string
}

export interface VehicleDetailsModel {
  registrationNo: string
  vehicleMake: string
  vehicleModel: string
  powerSource: string
}

export interface ProviderDetailsModel {
  id: string
  name: string
  short_desc: string
  long_desc: string
  rating: string
}
