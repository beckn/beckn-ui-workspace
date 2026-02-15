/**
 * Generic types for Beckn 2.0 payload builders.
 * Domain-agnostic so any app can use the standard payload structure.
 */

/** Single item input for building Select order (id, quantity, provider, optional attributes) */
export interface SelectInputItem {
  id: string
  quantity: number
  providerId: string
  /** Domain-specific order item attributes (e.g. port_type for EV) */
  orderItemAttributes?: Record<string, unknown>
  /** Optional unit code (e.g. KWH) */
  unitCode?: string
}

/** Options for building Select request */
export interface BuildSelectRequestOptions {
  items: SelectInputItem[]
  transactionId: string
  bppId: string
  bppUri: string
  domain?: string
  location?: Record<string, unknown>
  /** Default buyer; can be overridden per domain */
  buyer?: {
    id?: string
    displayName?: string
    telephone?: string
    email?: string
  }
  /** Schema context URL for @context and order type (e.g. EV Charging schema) */
  schemaContext: string
  /** Order status to send (e.g. CONFIRMED) */
  orderStatus?: string
}

/** Customer/fulfillment contact for Init */
export interface FulfillmentCustomer {
  name: string
  phone?: string
  email?: string
  address?: string
}

/** Options for building Init request */
export interface BuildInitRequestOptions {
  /** Customer / shipping details */
  customer: FulfillmentCustomer
  /** Quantity or updated quantity (string for flexibility) */
  quantity?: string
  fulfillmentId?: string
  fulfillmentType?: string
  /** Fulfillment mode (e.g. EV_CHARGING, DELIVERY) */
  fulfillmentMode?: string
  /** Schema context URL */
  schemaContext: string
}

/** Options for building Confirm request */
export interface BuildConfirmRequestOptions {
  /** Schema context URL */
  schemaContext: string
  /** Accepted payment methods (optional) */
  acceptedPaymentMethods?: string[]
}

/** Options for building context (shared across select/init/confirm) */
export interface BuildContextOptions {
  transactionId: string
  bppId: string
  bppUri: string
  action: string
  domain?: string
  location?: Record<string, unknown>
  /** BAP id (default from env NEXT_PUBLIC_BAP_ID) */
  bapId?: string
  /** BAP uri (default from env NEXT_PUBLIC_BAP_URI) */
  bapUri?: string
  /** Schema context URLs (e.g. [EV_CHARGING_SCHEMA]) */
  schemaContext?: string[]
  ttl?: string
  version?: string
}
