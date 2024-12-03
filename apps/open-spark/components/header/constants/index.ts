type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp', '/welcome']
const homeIconBlackList = ['/', '/signIn', '/', '/myRides', '/signUp', '/welcome']
const menuIconWhiteList = ['/', '/profile', '/myRides']
const topHeaderBlackList: string[] = ['/welcome']
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signIn']

const headerNames: PathnameObjectType = {
  '/myRides': 'My Rides',
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up',
  '/paymentMode': 'Select Payment Method',
  '/profile': 'Profile'
}

const headerFrenchNames: PathnameObjectType = {
  '/rideHistory': 'Historique des Commandes',
  '/': 'Se Connecter',
  '/paymentMode': 'Sélectionner la Méthode de Paiement'
}

const headerBlackList = ['/myRides', '/', '/paymentMode', '/profile', '/signIn', '/signUp', '/welcome']

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback', '/welcome']
const orderIconList = ['/orderDetails']
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
    orderIconList,
    bottomHeaderBlackList,
    editIconList
  }
}
