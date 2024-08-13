type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['']
const homeIconBlackList = ['/', '/cancelRide', '/paymentMode', '/feedback', '/searchRide']
const menuIconWhiteList = ['']
const topHeaderBlackList = ['/feedback']
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/cancelRide']

const headerNames: PathnameObjectType = {
  '/rideHistory': 'My Rides',
  '/paymentMode': 'Select Payment Method',
  '/profile': 'Profile'
}

const headerFrenchNames: PathnameObjectType = {
  '/rideHistory': 'Historique des Commandes',
  '/': 'Se Connecter',
  '/paymentMode': 'Sélectionner la Méthode de Paiement'
}

const headerBlackList = ['/rideHistory', '/', '/paymentMode', '/profile']

const bottomHeaderBlackList = ['/', '/searchRide', '/searchRideForm', '/cancelRide', '/feedback']

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
    bottomHeaderBlackList
  }
}
