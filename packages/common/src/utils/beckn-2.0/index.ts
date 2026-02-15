/**
 * Beckn 2.0 generic payload builders and normalizers.
 * Any app (EV charging, retail, etc.) can use these for standard Select / Init / Confirm payload structure.
 */

export { buildContext } from './context'
export { buildSelectRequest20 } from './select'
export { buildInitRequest20 } from './init'
export { buildConfirmRequest20 } from './confirm'
export { normalizeInitResponse20ToLegacy, normalizeConfirmResponse20ToLegacy } from './normalize'
export type {
  BuildContextOptions,
  BuildSelectRequestOptions,
  BuildInitRequestOptions,
  BuildConfirmRequestOptions,
  SelectInputItem,
  FulfillmentCustomer
} from './types'
