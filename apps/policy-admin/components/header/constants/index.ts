type PathnameObjectType = Record<string, string>

// -------------------------------- Sub Header constants --------------------------------
const backIconList = ['/signIn', '/signUp']

const headerBlackList = ['/signUp', '/signIn']

const headerNames: PathnameObjectType = {
  '/': 'Summary',
  '/signIn': 'Sign In',
  '/signUp': 'Sign Up',
  '/createPolicy': 'New Information',
  '/policyDetails': 'Information Details',
  '/createGeofence': 'Draw Geofencing'
}

const headerFrenchNames: PathnameObjectType = {}

export default {
  backIconList,
  headerNames,
  headerBlackList,
  headerFrenchNames
}
