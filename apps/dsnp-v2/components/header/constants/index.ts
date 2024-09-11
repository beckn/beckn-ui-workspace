type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = [
  '/signin',
  '/signUp',
  '/',
  '/search',
  '/product',
  '/cart',
  '/checkout',
  '/paymentMode',
  '/orderConfirmation',
  '/orderDetails',
  '/invoiceDetails',
  '/profile',
  '/orderHistory',
  '/feedback'
]
const homeIconBlackList = ['/', '/signin', '/mobileOtp', '/paymentMode', '/signUp']
const menuIconWhiteList = ['/', '/search', '/profile']
const topHeaderBlackList: string[] = []
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signin']

const headerNames: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'My Orders',
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
  '/profile': 'My Profile',
  '/search': 'Search results',
  '/checkout': 'Billing & Shipping'
}

const headerFrenchNames: PathnameObjectType = {
  '/checkoutPage': 'Facturation et Livraison',
  '/orderHistory': 'Historique des Commandes',
  '/orderDetails': 'Détails de la Commande',
  '/': 'Se Connecter',
  '/mobileOtp': 'Se Connecter',
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner la Méthode de Paiement',
  '/feedback': ''
}

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
  '/signin',
  '/mobileOtp',
  '/checkout',
  '/paymentMode',
  '/signUp',
  '/invoiceDetails',
  '/',
  '/cart',
  '/profile',
  '/orderCancellation',
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
    headerFrenchNames,
    headerBlackList,
    cartIconBlackList,
    bottomHeaderBlackList,
    orderIconList,
    invoiceDownloadIcon
  }
}
