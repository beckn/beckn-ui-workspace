type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp']
const homeIconBlackList = ['/', '/signIn', '/', '/profile', '/signUp', '/OTPVerification', '/paymentMode', '/withdraw']
const menuIconWhiteList = [
  '/',
  '/profile',
  '/myRides',
  '/buyingPreference',
  '/sellingPreference',
  '/myDers',
  '/myFunds'
]
const topHeaderBlackList: string[] = []
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
  '/tradeDetails': 'No. of Units Sold',
  '/OTPVerification': 'Verify Yourself',
  '/myFunds': 'My Funds',
  '/withdraw': 'Withdraw',
  '/myPreference': 'My Preferences'
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
  '/myCredentials',
  '/myTrades',
  '/buyingPreference',
  '/sellingPreference',
  '/myDers',
  '/tradeDetails',
  '/OTPVerification',
  '/myFunds',
  '/myPreference',
  '/withdraw'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback', '/peerToPeer']
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
