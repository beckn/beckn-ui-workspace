export interface RetailContext {
  bppUri: string
  bppId: string
  action?: string
  bap_id?: string
  bap_uri?: string
  bpp_id: string
  bpp_uri: string
  city?: string
  core_version?: string
  country?: string
  domain?: string
  max_callbacks?: number
  message_id?: string
  timestamp?: string
  transactionId: string
  ttl?: string
}

export interface ResponseModel {
  customerDetails: any
  transactionId: any
  scholarshipProvider: any
  context: RetailContext
  message: any
  // Hacky fix
  name: string
}
