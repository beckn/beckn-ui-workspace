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
  name?: string
  mobileNumber?: string
  email?: string
  address?: string
  pinCode?: string
  scholarshipInfo?: string
}

interface MessageDescriptor {
  name: string
  short_desc: string
}

interface ItemDescriptor {
  name: string
  short_desc: string
}

interface FormData {
  name: string
  phone: string
  address: string
  needOfScholarship: string
  docUrl: string
}

interface Form {
  required: boolean
  url: string
  data: FormData
  mime_type: string
  submission_id: string
}

interface Tag {
  display: boolean
  descriptor: {
    code: string
    name: string
  }
  list: {
    descriptor: {
      code: string
      name: string
    }
    value: string
    display: boolean
  }[]
}

interface Price {
  currency: string
  value: string
}

interface Contact {
  phone: string
  email: string
}

interface TimeStamp {
  timestamp: string
}

interface Stop {
  type: string
  time: TimeStamp
}

interface Fulfillment {
  id: string
  type: string
  tracking: boolean
  customer: {
    person: {
      name: string
      gender: string
    }
  }
  contact: Contact
  stops: Stop[]
}

interface Item {
  id: string
  descriptor: ItemDescriptor
  price: Price
  xinput: Form
  rateable: boolean
  tags: Tag[]
  category_ids: string[]
}

interface ProviderDescriptor {
  name: string
  short_desc: string
}

interface Provider {
  id: string
  descriptor: ProviderDescriptor
  rateable: boolean
}

interface LocationDescriptor {
  name: string
  code: string
}

interface Location {
  city: LocationDescriptor
  country: LocationDescriptor
}

interface Context {
  domain: string
  action: string
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: Location
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

interface Order {
  id: string
  status: string
  type: string
  provider: Provider
  items: Item[]
  fulfillments: Fulfillment[]
}

interface Message {
  order: Order
}

export interface ScholarshipConfirmResponseModel {
  context: Context
  message: Message
}

interface Amount {
  amount: string
  currency: string
}

interface AdditionalFormData {
  formUrl: string
  formMimeType: string
  data: any[] // Change to a more specific type if needed
}

interface Scholarship {
  id: string
  name: string
  description: string
  amount: Amount
  additionalFormData: AdditionalFormData
}

interface ScholarshipProvider {
  id: string
  name: string
  description: string
  scholarships: Scholarship[]
}

interface Context {
  transactionId: string
  bppId: string
  bppUri: string
}

export interface ScholarShipSelectResponseModel {
  context: Context
  scholarshipProviders: ScholarshipProvider[]
}
