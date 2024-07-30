type PathnameObjectType = Record<string, string>

// // -------------------------------- Top Header constants --------------------------------

const appLogoBlackList = ['/signIn', '/signUp']
const homeIconBlackList = ['/', '/signIn', '/mobileOtp', '/paymentMode', '/signUp']
const menuIconWhiteList = ['/', '/search', '/profile', '/cart']
const topHeaderBlackList: string[] = []
const languageIconWhiteList = ['/', '/createProfile', '/signIn', '/signUp']

// // -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signIn']

const headerNames: PathnameObjectType = {
  '/checkoutPage': 'Review Purchase Order',
  '/orderHistory': 'My Orders',
  '/orderDetails': 'Order Details',
  '/invoiceDetails': 'Invoice Details',
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/assemblyDetails': 'Add Assembly Details',
  '/updateShippingDetails': 'Shipping Details',
  '/orderCancellation': 'Order Cancel',
  '/feedback': '',
  '/profile': 'Profile',
  '/search': 'Search results',
  '/checkout': 'Billing & Shipping'
}

const headerFrenchNames: PathnameObjectType = {
  '/checkoutPage': 'Revoir le bon de commande',
  '/orderHistory': 'Mes commandes',
  '/orderDetails': 'Détails de la commande',
  '/invoiceDetails': 'Détails de la facture',
  '/signIn': 'Se connecter',
  '/signUp': "S'inscrire",
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner le mode de paiement',
  '/assemblyDetails': "Ajouter les détails d'assemblage",
  '/updateShippingDetails': 'Mettre à jour les informations de livraison',
  '/orderCancellation': 'Annulation de commande',
  '/feedback': '', // Leave empty as instructed
  '/profile': 'Profil',
  '/search': 'Résultats de recherche',
  '/checkout': 'Facturation et livraison'
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
  '/checkoutPage',
  '/paymentMode',
  '/signUp',
  '/invoiceDetails',
  '/',
  '/cart',
  '/checkout',
  '/profile',
  '/orderCancellation',
  '/updateShippingDetails',
  '/orderCancellation'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/searchByLocation']
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
