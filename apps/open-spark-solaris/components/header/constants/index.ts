type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp']
const homeIconBlackList = [
  '/',
  '/signIn',
  '/',
  '/profile',
  '/signUp',
  '/OTPVerification',
  '/paymentMode',
  '/withdraw',
  '/search',
  '/myStore',
  '/cart',
  '/checkout',
  '/newPaymentOverView',
  '/retailPaymentMethod',
  '/retailOrderConfirmation',
  '/product',
  '/secureCheckout',
  '/upiScreen',
  '/rentAndHire',
  '/confirmRent'
]
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
const backIconList = ['/', '/signIn', '/myStore', '/rentAndHire']

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
  '/myPreference': 'My Preferences',
  '/search': 'Search Results',
  '/myStore': '',
  '/cart': 'Cart',
  '/checkout': 'Billing & Shipping',
  '/confirmRent': 'Confirm Rent',
  '/newPaymentOverView': 'New Payment Overview ',
  '/retailPaymentMethod': 'Select Payment Method',
  '/orderHistory': 'My Orders',
  '/secureCheckout': 'Secure Checkout',
  '/myRental': 'My Rentals',
  '/rentAndHire': '',
  '/orderServices': 'My Services'
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
  '/withdraw',
  '/search',
  '/myStore',
  '/cart',
  '/checkout',
  '/newPaymentOverView',
  '/retailPaymentMethod',
  '/orderHistory',
  '/confirmRent',
  '/secureCheckout',
  '/myRental',
  '/rentAndHire',
  '/orderServices'
]

const cartIconBlackList: string[] = [
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
  '/withdraw',
  '/cart',
  '/checkout',
  '/confirmRent',
  '/newPaymentOverView',
  '/retailPaymentMethod',
  '/orderHistory',
  '/secureCheckout',
  '/myRental',
  '/rentAndHire'
]
const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback', '/retailOrderConfirmation', '/upiScreen']
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
    infoIconList,
    cartIconBlackList
  }
}
