type PathnameObjectType = Record<string, string>

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/']

const headerNames: PathnameObjectType = {
  '/rideHistory': 'My Rides',
  '/paymentMode': 'Select Payment Method',
  '/profile': 'Profile'
}

const headerFrenchNames: PathnameObjectType = {
  '/rideHistory': 'Historique des Commandes',
  '/': 'Se Connecter',
  '/paymentMode': 'Sélectionner la Méthode de Paiement'
}

const headerBlackList = ['/rideHistory', '/', '/paymentMode', '/profile']

const bottomHeaderBlackList = ['/']

export default {
  SubHeader: {
    backIconList,
    headerNames,
    headerFrenchNames,
    headerBlackList,
    bottomHeaderBlackList
  }
}
