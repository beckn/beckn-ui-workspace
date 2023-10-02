interface ScholarshipDetails {
  id: string
  type: string
  applicationStartDate: string
  applicationEndDate: string
  supportContact: {
    phone: string
    email: string
  }
}

interface Scholarship {
  id: string
  name: string
  description: string
  userSavedItem: boolean
  userAppliedItem: boolean
  amount: {
    amount: string
    currency: string
  }
  categories: {
    id: string
    code: string
    name: string
  }[]
  scholarshipDetails: ScholarshipDetails[]
}

interface ScholarshipProvider {
  id: string
  name: string
  scholarships: Scholarship[]
}

interface Context {
  transactionId: string
  messageId: string
  bppId: string
  bppUri: string
}

export interface ScholarshipSearchResponse {
  context: Context
  scholarshipProviders: ScholarshipProvider[]
  scholarshipProviderPlatform: string
}

export interface ParsedScholarshipData {
  providerName: string
  platformName: string
  bppId: string
  bppUri: string
  transactionId: string
  description: string
  amount: {
    amount: string
    currency: string
  }
  id: string
  name: string
  scholarshipDetails: {
    id: string
    type: string
    applicationStartDate: string
    applicationEndDate: string
    supportContact: {
      phone: string
      email: string
    }
  }[]
  providerId: string
}

export interface ScholarshipApplyFormDataModel {
  name: string
  mobileNumber: string
  email: string
  address: string
  pinCode: string
  scholarshipInfo: string
}
