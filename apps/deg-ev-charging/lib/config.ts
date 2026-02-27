export const currencyMap = {
  EUR: '€',
  INR: '₹',
  USD: '$',
  GMD: 'D',
  USA: '$',
  IND: '₹'
}

export enum ROLE {
  'GENERAL' = 'GENERAL'
}

export const ROUTE_TYPE = {
  GENERAL: '/unified-beckn-energy'
}

export const DOMAIN = 'beckn.one:deg:ev-charging:*'
export const ORDER_CATEGORY_ID = 40

export const DOMAIN_PATH = {
  MY_STORE: 'deg:retail',
  RENT_AND_HIRE: 'deg:rental'
}

/** Configurable header: top bar = app name + home; second bar = back + page title */
export const HEADER_CONFIG = {
  /** App name shown in the top bar (e.g. "EV Hub", "Open Commerce") */
  appName: 'EV Hub',
  /** Show home button in the top bar (right side) */
  showHomeButton: true,
  /** Use two-row layout: row 1 = app name + home, row 2 = back + page title */
  useTwoRowHeader: true,
  /** Routes where the title row (second row) is hidden; only logo + home row is shown. e.g. homepage '/' */
  hideTitleOnRoutes: ['/'] as string[]
}
