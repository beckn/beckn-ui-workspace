type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp', '/OTPVerification', '/discovery']
const homeIconBlackList = [
  '/',
  '/feedback',
  '/signIn',
  '/signUp',
  '/OTPVerification',
  '/discovery',
  '/profile',
  '/orderHistory',
  '/checkout',
  '/paymentMode',
  '/secureCheckout',
  '/orderConfirmation',
  '/monitorCharging',
  '/orderDetails',
  '/navigation'
]
const menuIconWhiteList = ['']
const topHeaderBlackList = ['/feedback', '/', '/navigation', '/discovery']
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/cancelRide', '/signIn', '/orderHistory', '/profile']

const headerNames: PathnameObjectType = {
  '/paymentMode': 'Select Payment Method',
  '/profile': 'Profile',
  '/quarantineZone': 'Quarantine Zone',
  '/geofence': 'Geofence',
  '/policies': 'Policies',
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up',
  '/OTPVerification': 'Verify OTP',
  '/orderHistory': 'Chargers',
  '/checkout': 'Book Charger',
  '/secureCheckout': 'Payment Gateway',
  '/orderConfirmation': 'Confirm Booking',
  '/monitorCharging': 'Monitor Charging',
  '/orderDetails': 'Order Details',
  '/navigation': 'Navigation'
}

const headerFrenchNames: PathnameObjectType = {
  '/rideHistory': 'Historique des Commandes',
  '/': 'Se Connecter',
  '/paymentMode': 'Sélectionner la Méthode de Paiement'
}

const headerBlackList = [
  '/orderHistory',
  '/',
  '/paymentMode',
  '/profile',
  '/quarantineZone',
  '/geofence',
  '/policies',
  '/signIn',
  '/signUp',
  '/OTPVerification',
  '/discovery',
  '/checkout',
  '/secureCheckout',
  '/orderConfirmation',
  '/monitorCharging',
  '/orderDetails',
  '/navigation'
]

const bottomHeaderBlackList = ['/', '/searchRide', '/searchRideForm', '/cancelRide', '/feedback']
const editIconList: string[] = ['/profile']

export default {
  TopHeader: {
    appLogoBlackList,
    homeIconBlackList,
    menuIconWhiteList,
    topHeaderBlackList,
    languageIconWhiteList
  },
  SubHeader: {
    backIconList,
    headerNames,
    headerFrenchNames,
    headerBlackList,
    bottomHeaderBlackList,
    editIconList
  }
}
