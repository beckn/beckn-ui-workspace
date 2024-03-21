export const AppRoutes = {
  admin: '/sign-in-password',
  signUp: '/sign-up',
  signInOtp: '/sign-in-phone',
  signInPassword: '/sign-in-password',
  adminDashboard: '/admin-dashboard',
  driverDashboard: '/dashboard',
  addVehicle: '/add-vehicles',
  accountRegistration: '/account-Registration',
  endRide: '/ride-end'
}

export const LocalKey = {
  saveApi: 'saveApi',
  saveUser: 'saveUser',
  spinnerKey: 'taxiSpinner',
  saveActiveRide: 'saveActiveRide',
  saveDriverStatus: 'saveStatus'
}

export const NoHeader = [
  '/',
  AppRoutes.admin,
  AppRoutes.signInOtp,
  AppRoutes.signInPassword,
  AppRoutes.signUp,
  AppRoutes.accountRegistration
]

export const DocumentType = {
  Aadhar: 'Aadhar',
  Pan: 'Pan',
  Licence: 'Licence',
  RC: 'RC',
  FITNESS: 'FITNESS',
  INSURANCE: 'INSURANCE'
}

export const commonMsg = {
  NoValue: 'Not Available'
}

export const SearchGroupsCode: any = {
  PinCode: 'pin_codes',
  State: 'states',
  City: 'cities'
}

export const GroupsCode: any = {
  PinCode: 'PinCodes',
  State: 'States',
  City: 'Cities'
}

export const NoLoader = ['user/cities/search', 'user/pin_codes/search', 'user/states/search', 'trips/show']

export const NoLoaderPath = 'trips/show'
