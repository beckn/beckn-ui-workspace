type PathnameObjectType = Record<string, string>

// -------------------------------- Top Header constants --------------------------------
const appLogoBlackList = ['/signin', '/signUp', '/feedback']
const homeIconBlackList = ['/', '/signin', '/mobileOtp', '/paymentMode', '/signUp']
const menuIconWhiteList = ['/', '/profile']
const topHeaderBlackList: string[] = []
const languageIconWhiteList: string[] = []

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/', '/signin']

const headerNames: PathnameObjectType = {
  '/checkoutPage': 'Checkout',
  '/orderHistory': 'My Courses',
  '/orderDetails': 'Order Details',
  '/signin': 'Sign In',
  '/signUp': 'Sign Up',
  '/mobileOtp': 'Sign In',
  '/cart': 'Cart',
  '/paymentMode': 'Select Payment Method',
  '/jobSearch': 'Jobs',
  '/feedback': 'Feedback',
  '/jobDetails': 'Jobs',
  '/createProfile': 'Create Profile',
  '/myScholarship': 'My Scholarships',
  '/scholarshipSearchPage': 'Scholarships',
  '/scholarshipDetailsPage': 'Scholarships',
  '/myLearningOrderHistory': 'My Learnings',
  '/myJobsOrderHistory': 'My Jobs',
  '/applyJobsPrefilled': 'My Jobs',
  '/search': 'Search Results',
  '/applyScholarship': 'Add details'
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
  '/homePage',
  '/orderConfirmation',
  'feedback',
  '/',
  '/mobileOtp',
  '/paymentMode',
  '/jobDetails',
  '/jobSearch',
  '/search',
  '/createProfile',
  '/myScholarship',
  '/scholarshipSearchPage',
  '/scholarshipDetailsPage',
  '/myLearningOrderHistory',
  '/myJobsOrderHistory',
  '/applyJobsPrefilled',
  '/applyScholarship',
  '/signUp',
  '/signin',
  '/orderCancellation',
  '/feedback'
]

const cartIconBlackList: string[] = [
  '/orderConfirmation',
  '/orderDetails',
  '/trackOrder',
  '/feedback',
  '/orderHistory',
  '/',
  '/signin',
  '/signUp',
  '/mobileOtp',
  '/cart',
  '/checkoutPage',
  '/paymentMode',
  '/jobSearch',
  '/jobDetails',
  '/jobApply',
  '/createProfile',
  '/myScholarship',
  '/myLearningOrderHistory',
  '/myJobsOrderHistory',
  '/applyJobsPrefilled',
  '/orderCancellation',
  '/feedback'
]

const bottomHeaderBlackList = ['/orderConfirmation', '/', '/feedback']
// const orderIconList = ['/orderDetails']
// const invoiceDownloadIcon = ['/']

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
    bottomHeaderBlackList
    // orderIconList
    // invoiceDownloadIcon
  }
}
