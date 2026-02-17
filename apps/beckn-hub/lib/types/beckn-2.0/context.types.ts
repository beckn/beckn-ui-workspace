/**
 * Beckn 2.0 context types.
 * Plain keys (no beckn:/schema: prefix).
 */
export interface BecknContext {
  domain?: string
  version: string
  bap_id: string
  bap_uri: string
  bpp_id?: string
  bpp_uri?: string
  transaction_id: string
  message_id: string
  timestamp: string
  ttl?: string
  schema_context?: string | string[]
  action: string
  location?: Record<string, unknown>
  [key: string]: unknown
}

export interface BecknRequest<TMessage = unknown> {
  context: BecknContext
  message: TMessage
}
