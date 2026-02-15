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
  /** Optional unit text (e.g. Kilowatt Hour) – app can pass from app level */
  unitText?: string
}

/** Options for building Select request. All optional fields can be passed from app level. */
export interface BuildSelectRequestOptions {
  items: SelectInputItem[]
  transactionId: string
  bppId: string
  bppUri: string
  domain?: string
  location?: Record<string, unknown>
  /** Buyer – pass from app level (id, displayName, telephone, email) */
  buyer?: {
    id?: string
    displayName?: string
    telephone?: string
    email?: string
  }
  /** Schema context URL for tag types / orderItemAttributes (e.g. EV Charging schema) */
  schemaContext: string
  /** Order status – pass from app level (e.g. CREATED, CONFIRMED) */
  orderStatus?: string
  /** Order @context URL – pass from app level if different from schemaContext */
  orderContext?: string
  /** Order @type – pass from app level (e.g. beckn:Order) */
  orderType?: string
  /** Buyer @context URL – pass from app level */
  buyerContext?: string
  /** Buyer @type – pass from app level (e.g. beckn:Buyer) */
  buyerType?: string
  /** Buyer beckn:role – pass from app level (e.g. BUYER) */
  buyerRole?: string
}

/** Customer/fulfillment contact for Init */
export interface FulfillmentCustomer {
  name: string
  phone?: string
  email?: string
  address?: string
}

/** Options for building Init request. Pass from app level (domain, etc.) as needed. */
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
  /** Override context.domain (e.g. beckn.one:deg:ev-charging:*) – pass from app level */
  domain?: string
}

/** Options for building Confirm request */
export interface BuildConfirmRequestOptions {
  /** Schema context URL (for payment @context, use paymentContext if different) */
  schemaContext: string
  /** Payment status: INITIATED or PAID */
  paymentStatus?: string
  /** Accepted payment methods (sent as beckn:acceptedPaymentMethods) */
  acceptedPaymentMethods?: string[]
  /** Payment block @context (defaults to schemaContext); use core v2 for payment */
  paymentContext?: string
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
