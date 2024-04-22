interface Location {
  country: {
    name: string
    code: string
  }
  city: {
    name: string
    code: string
  }
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

interface SupportMessage {
  ref_id: string
  callback_phone: string
  phone: string
  email: string
  url: string
}

interface Message {
  support: SupportMessage
}

interface SupportResponsePerBpp {
  context: Context
  message: Message
}

export interface SupportResponseModel {
  data: SupportResponsePerBpp[]
}
