export interface FilterPropsModel {
  handleApplyFilter: (sortBy: string) => void
  handleResetFilter: () => void
  handleCancelFilter?: () => void
}

interface Descriptor {
  name: string
  short_desc?: string
  long_desc?: string
  code?: string
}

interface Image {
  url: string
}

interface Tag {
  display: boolean
  descriptor: Descriptor
  list?: {
    display: boolean
    descriptor: Descriptor
    value: string
  }[]
  value?: string
}

export interface ImportedOrderItem {
  id: string
  descriptor: {
    name: string
    long_desc: string
    images: Image[]
  }
  price: {
    listed_value: string
    currency: string
    value: string
  }
  quantity: {
    selected: {
      count: number
    }
  }
  fulfillment_ids: string[]
  tags: Tag[]
}

interface Location {
  gps: string
  address: string
  city: {
    name: string
  }
  state: {
    name: string
  }
  country: {
    code: string
  }
  area_code: string
}

interface Contact {
  phone: string
  email: string
}

interface Stop {
  location: Location
  contact: Contact
}

interface Fulfillment {
  id: string
  type: string
  customer: {
    contact: Contact
    person: {
      name: string
    }
  }
  stops: Stop[]
  tracking: boolean
}

interface Price {
  currency: string
  value: string
}

interface Breakup {
  title: string
  price: Price
}

interface Quote {
  price: Price
  breakup: Breakup[]
}

interface Billing {
  name: string
  phone: string
  email: string
  address: string
  city: {
    name: string
  }
  state: {
    name: string
  }
}

interface Payment {
  id: string
  name: string
  status: string
  type: string
  params: {
    amount: string
    currency: string
    transaction_id: string
  }
  time: {
    label: string
    timestamp: string
  }
}

export interface ImportedOrderModel {
  id: string
  status: string
  provider: {
    id: string
    descriptor: Descriptor
    tags: Tag[]
  }
  items: ImportedOrderItem[]
  fulfillments: Fulfillment[]
  quote: Quote
  billing: Billing
  payments: Payment[]
  tags: Tag[]
  type: string
}

export type ImportedOrderShoppingList = Array<string>
