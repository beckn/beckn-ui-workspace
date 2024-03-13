interface Context {
    ttl: string
    action: string
    timestamp: string
    message_id: string
    transaction_id: string
    domain: string
    core_version: string
    bap_id: string
    bap_uri: string
    country: string
    city: string
    bpp_id: string
    bpp_uri: string
    max_callbacks: number
}

interface Message {
    order: Order
}

interface Order {
    offers: Offer[]
    created_at: string
    provider_location: ProviderLocation
    billing: Billing
    fulfillments: Fulfillment[]
    quote: Quote
    updated_at: string
    provider: Provider
    payment: Payment
    id: string
    fulfillment: FulfillmentDetail
    state: string
    items: Item[]
    displayId: string
}

interface Offer {
    // Assuming no detailed structure provided, so left as any[]
}

interface ProviderLocation {
    address: Address
    descriptor: Descriptor
    time: LocationTime
    id: string
    gps: string
}

interface Address {
    country: string
    city: string
    street?: string
    area_code: string
    name?: string
    locality?: string
    state: string
    door: string
}

interface Descriptor {
    name: string
    code?: string // Optional, based on usage
    // Additional fields for items
    symbol?: string
    images?: string[]
    short_desc?: string
    long_desc?: string
}

interface LocationTime {
    schedule: Schedule
    days: string
    label: string
    timestamp: string
}

interface Schedule {
    holidays: string[] // Assuming specific detail not provided, so using string[]
    frequency: string
}

interface Billing {
    address: Address
    phone: string
    name: string
    email: string
}

interface Fulfillment {
    contact: Contact
    start: FulfillmentStart
    provider_id: string
    end: FulfillmentEnd
    state: State
    id: string
    rateable: boolean
    type: string
    tracking: boolean
    customer: Customer
}

interface Contact {
    phone: string
    email: string
}

interface FulfillmentStart {
    contact: Contact
    location: FulfillmentLocation
    time: FulfillmentTime
}

interface FulfillmentEnd {
    person: Person // Assuming empty object means no further detail provided, so using any
    contact: Contact
    location: FulfillmentLocation
    time: FulfillmentTime
}

interface FulfillmentLocation extends ProviderLocation {
    // Inherits all properties from ProviderLocation
}

interface FulfillmentTime {
    range: TimeRange
}

interface TimeRange {
    start: string
    end: string
}

interface State {
    descriptor: Descriptor
}

interface Customer {
    person: Person // Assuming empty object means no further detail provided, so using any
}

interface Person {
    // Assuming no detailed structure provided, so left as any
}

interface Quote {
    breakup: Breakup[]
    price: Price
    ttl: string
}

interface Breakup {
    price: Price
    title: string
    type: string
    item?: ItemBreakup // Optional, based on usage
}

interface ItemBreakup {
    category_id: string
    related: boolean
    location_ids: string[]
    price: Price
    matched: boolean
    descriptor: Descriptor
    id: string
    payment_ids: string[]
    rateable: boolean
    location_id: string
    recommended: boolean
}

interface Price {
    currency: string
    value: string
    listed_value?: string
    offered_value?: string
    maximum_value?: string
}

interface Provider {
    category_id: string
    locations: ProviderLocation[]
    descriptor: Descriptor
    id: string
    rateable: boolean
    ttl: string
}

interface Payment {
    collected_by: string
    type: string
    params: PaymentParams
    uri: string
    tl_method: string
    status: string
}

interface PaymentParams {
    amount: string
    currency: string
}

interface FulfillmentDetail extends Fulfillment {
    // Inherits all properties from Fulfillment and can add more if needed
}

interface Item {
    quantity: Quantity
    location_ids: string[]
    descriptor: Descriptor
    payment_ids: string[]
    rateable: boolean
    location_id: string
    fulfillment_id: string
    recommended: boolean
    category_id: string
    related: boolean
    price: Price
    matched: boolean
    id: string
}

interface Quantity {
    count: number
}

export interface StatusResponseModel {
    context: Context
    message: Message
}
