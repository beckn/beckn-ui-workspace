type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signIn', '/signUp']
const homeIconBlackList = ['/', '/signIn', '/mobileOtp', '/paymentMode', '/signUp']
const menuIconWhiteList = ['/', '/search', '/product', '/cart', '/orderHistory']
const topHeaderBlackList: string[] = []
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signIn']

const headerNames: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'Request History',
  '/orderDetails': 'Order Details',
  '/invoiceDetails': 'Invoice Details',
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up',
  '/cart': 'Request Overview',
  '/paymentMode': 'Select Payment Method',
  '/assemblyDetails': 'Add Assembly Details',
  '/updateShippingDetails': 'Shipping Details',
  '/orderCancellation': 'Order Cancel',
  '/feedback': '',
  '/profile': 'My Profile',
  '/search': 'Search results',
  '/checkout': 'Billing'
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
  '/signIn'
]

const cartIconBlackList: string[] = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/signIn',
  '/mobileOtp',
  '/checkout',
  '/paymentMode',
  '/signUp',
  '/invoiceDetails',
  '/',
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
