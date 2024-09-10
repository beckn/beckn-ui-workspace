type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signin', '/signUp']
const homeIconBlackList = ['/', '/homePage', '/mobileOtp', '/paymentMode', '/signUp', '/signin']
const menuIconWhiteList = ['/', '/profile']
const topHeaderBlackList: string[] = []
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signin']

const headerNames: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'Order History',
  '/orderDetails': 'Order Details',
  '/invoiceDetails': 'Invoice Details',
  '/signin': 'Sign In',
  '/signUp': 'Sign Up',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/assemblyDetails': 'Add Assembly Details',
  '/updateShippingDetails': 'Shipping Details',
  '/orderCancellation': 'Order Cancel',
  '/feedback': '',
  '/profile': 'My Profile'
}

const headerFrenchNames = {}

const headerBlackList = [
  '/checkoutPage',
  '/orderHistory',
  '/orderDetails',
  '/cart',
  '/',
  '/orderConfirmation',
  'feedback',
  '/',
  '/signUp',
  '/mobileOtp',
  '/paymentMode',
  '/invoiceDetails',
  '/assemblyDetails',
  '/updateShippingDetails',
  '/orderCancellation',
  '/profile',
  '/search',
  '/checkout',
  '/signin'
]

const cartIconBlackList: string[] = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/',
  '/mobileOtp',
  '/cart',
  '/checkoutPage',
  '/paymentMode',
  '/search',
  '/product',
  '/signUp',
  '/signin',
  '/invoiceDetails',
  '/assemblyDetails',
  '/updateShippingDetails'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback']
const orderIconList = ['/orderDetails']
const invoiceDownloadIcon = ['/']

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
    headerBlackList,
    headerFrenchNames,
    cartIconBlackList,
    bottomHeaderBlackList,
    orderIconList,
    invoiceDownloadIcon
  }
}
