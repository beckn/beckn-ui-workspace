type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp']
const homeIconBlackList = ['/', '/signIn', '/', '/profile', '/signUp', '/OTPVerification', '/paymentMode', '/withdraw']
const menuIconWhiteList = ['/', '/profile', '/financialAssets']
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
  '/OTPVerification': 'OTP',
  '/financialAssets': 'Financial Assets',
  '/withdraw': 'Withdraw',
  '/myIdentities': 'My Identities',
  '/myAssets': 'My Assets',
  '/myTransactions': 'My Transactions',
  '/physicalAssets': 'Physical Assets',
  '/energyAssets': 'Energy Assets'
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
  '/financialAssets',
  '/myPreference',
  '/withdraw',
  '/myIdentities',
  '/myAssets',
  '/myTransactions',
  '/physicalAssets',
  '/energyAssets'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback']
const orderIconList = ['/orderDetails']
const editIconList: string[] = ['']
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
