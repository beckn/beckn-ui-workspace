type PathnameObjectType = Record<string, string>

export const backIconList = ['/', '/signIn']

export const headerNames: PathnameObjectType = {
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
  '/profile': 'My Profile',
  '/search': 'Search results',
  '/checkout': 'Billing & Shipping'
}

export const headerFrenchNames: PathnameObjectType = {
  '/checkoutPage': 'Facturation et Livraison',
  '/orderHistory': 'Historique des Commandes',
  '/orderDetails': 'Détails de la Commande',
  '/': 'Se Connecter',
  '/mobileOtp': 'Se Connecter',
  '/cart': 'Panier',
  '/paymentMode': 'Sélectionner la Méthode de Paiement',
  '/feedback': ''
}

export const headerBlackList = [
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

export const cartIconBlackList: string[] = [
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
  '/cart',
  '/profile',
  '/orderCancellation',
  '/updateShippingDetails'
]

export const orderIconList = ['/orderDetails']
export const invoiceDownloadIcon = ['/']
