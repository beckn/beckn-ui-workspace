type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp', '/welcome']
const homeIconBlackList = ['/', '/signIn', '/', '/myRides', '/profile', '/signUp', '/welcome']
const menuIconWhiteList = ['/', '/profile', '/myRides', '/buyingPreference', '/sellingPreference', '/myDers']
const topHeaderBlackList: string[] = ['/welcome']
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signIn']

const headerNames: PathnameObjectType = {
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up',
  '/paymentMode': 'Select Payment Method',
  '/profile': 'Profile',
  '/myCredentials': 'My Credentials',
  '/myTrades': 'My Trades',
  '/buyingPreference': 'Buying Preferences',
  '/sellingPreference': 'Selling Preferences',
  '/myDers': 'My DERs',
  '/tradeDetails': 'No. of Units Sold'
}

const headerFrenchNames: PathnameObjectType = {
  '/': 'Se Connecter',
  '/paymentMode': 'Sélectionner la Méthode de Paiement'
}

const headerBlackList = [
  '/',
  '/paymentMode',
  '/profile',
  '/signIn',
  '/signUp',
  '/welcome',
  '/myCredentials',
  '/myTrades',
  '/buyingPreference',
  '/sellingPreference',
  '/myDers',
  '/tradeDetails'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback', '/welcome']
const orderIconList = ['/orderDetails']
const editIconList: string[] = ['/profile']
const profileSectionIcon = ['/buyingPreference']
const infoIconList: string[] = ['/myDers']

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
    editIconList,
    profileSectionIcon,
    infoIconList
  }
}
