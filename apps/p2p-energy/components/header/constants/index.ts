type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList: string[] = ['/', '/signIn']
const homeIconBlackList = ['/', '/signIn', '/homePage', '/paymentMode']
const menuIconWhiteList = ['/', '/homePage', '/search']
const topHeaderBlackList: string[] = ['/']
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/homePage', '/signIn']

const headerNames: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderDetails': 'Order Details',
  '/invoiceDetails': 'Invoice Details',
  '/paymentMode': 'Select Payment Method',
  '/orderCancellation': 'Order Cancel',
  '/feedback': '',
  '/search': 'Search results',
  '/checkout': 'Billing',
  '/signIn': 'Sign In',
  '/orderHistory': 'My Orders'
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
  '/',
  '/orderConfirmation',
  '/orderHistory',
  'feedback',
  '/',
  '/homePage',
  '/paymentMode',
  '/invoiceDetails',
  '/orderCancellation',
  '/search',
  '/checkout',
  '/signIn'
]

const cartIconBlackList: string[] = [
  '/orderConfirmation',
  '/orderDetails',
  '/feedback',
  '/checkout',
  '/paymentMode',
  '/invoiceDetails',
  '/',
  '/homePage',
  '/orderCancellation',
  '/signIn',
  '/orderHistory'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/homePage', '/feedback']
const orderIconList = ['/orderDetails']
const invoiceDownloadIcon = ['/', '/homePage']

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
