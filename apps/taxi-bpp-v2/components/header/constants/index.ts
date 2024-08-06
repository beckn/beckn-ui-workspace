type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp']
const homeIconBlackList = ['/', '/signIn', '/', '/myRides', '/profile']
const menuIconWhiteList = ['/', '/profile', '/myRides']
const topHeaderBlackList: string[] = []
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signIn']

const headerNames: PathnameObjectType = {
  '/myRides': 'My Rides',
  '/signIn': 'Sign In',
  '/paymentMode': 'Select Payment Method',
  '/profile': 'Profile'
}

const headerFrenchNames: PathnameObjectType = {
  '/rideHistory': 'Historique des Commandes',
  '/': 'Se Connecter',
  '/paymentMode': 'Sélectionner la Méthode de Paiement'
}

const headerBlackList = ['/myRides', '/', '/paymentMode', '/profile', '/signIn']

const bottomHeaderBlackList = ['/']

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
