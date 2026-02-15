/**
 * Generic Beckn 2.0 store slice(s).
 * Any app can mount these and use the same state shape for Discover, Select/Init/Confirm, and optional Cart.
 */

export { default as checkoutBeckn20Reducer, checkoutBeckn20Actions } from './checkout-slice'
export type { CheckoutBeckn20State, CheckoutBeckn20RootState } from './checkout-slice'

export { default as discoverReducer, discoverActions } from './discover-slice'
export type { DiscoverBeckn20State, DiscoverBeckn20RootState, DiscoverState, DiscoverRootState } from './discover-slice'
