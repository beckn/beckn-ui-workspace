/**
 * Beckn 2.0 payload builders for EV Charging.
 * Data mapping uses plain keys (no beckn:/schema: prefix) for select, init, confirm API integration.
 */
import {
  buildSelectRequest20 as buildSelectRequest20Generic,
  buildInitRequest20 as buildInitRequest20Generic,
  buildConfirmRequest20 as buildConfirmRequest20Generic
} from '@beckn-ui/common'
import type { SelectRequest } from '@beckn-ui/common/lib/types/beckn-2.0/select'
import type { InitRequest } from '@beckn-ui/common/lib/types/beckn-2.0/init'
import type { ConfirmRequest } from '@beckn-ui/common/lib/types/beckn-2.0/confirm'
import type { BecknContext } from '@beckn-ui/common/lib/types/beckn-2.0/context.types'
import type { Order } from '@beckn-ui/common/lib/types/beckn-2.0/common.types'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'
import type { CartItemForRequest } from '@beckn-ui/common'
import type { SelectedCharger } from '@store/chargerSelect-slice'
import type { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'

const EV_CHARGING_SCHEMA =
  'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingService/v1/context.jsonld'

const CORE_V2_CONTEXT =
  'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld'

/** Domain for DEG EV Charging (beckn.one:deg:ev-charging:*) */
export const EV_CHARGING_DOMAIN = 'beckn.one:deg:ev-charging:*'

/** Default BPP when not present in context */
const DEFAULT_BPP_ID = 'ev-charging.sandbox1.com'
const DEFAULT_BPP_URI = 'http://onix-adapter:8081/bpp/receiver'

function ensureBppInContext(obj: { context?: Record<string, unknown> }): void {
  const ctx = obj.context
  if (!ctx || typeof ctx !== 'object') return
  if (ctx.bpp_id == null || ctx.bpp_id === '') ctx.bpp_id = DEFAULT_BPP_ID
  if (ctx.bpp_uri == null || ctx.bpp_uri === '') ctx.bpp_uri = DEFAULT_BPP_URI
}

export interface SelectBuyerInput {
  id?: string
  displayName?: string
  telephone?: string
  email?: string
}

/** Recursively map object keys: strip beckn: and schema: prefix so API receives plain keys */
function mapToPlainKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(mapToPlainKeys)
  if (typeof obj !== 'object') return obj
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const plain = k.startsWith('beckn:') ? k.slice(6) : k.startsWith('schema:') ? k.slice(7) : k
    out[plain] = mapToPlainKeys(v)
  }
  return out
}

/**
 * Build select request. Context is taken from previous API response (discover) when provided.
 */
export function buildSelectRequest20(
  items: CartItemForRequest[],
  transactionId: string,
  selectedCharger: SelectedCharger | null | undefined,
  catalog?: DiscoverCatalogStored | null,
  domain = EV_CHARGING_DOMAIN,
  buyer?: SelectBuyerInput | null,
  previousContext?: Record<string, unknown> | null
): SelectRequest {
  if (!items.length) throw new Error('Cart is empty')
  const ctx = previousContext && typeof previousContext === 'object' ? previousContext : null
  const bppId = ctx?.bpp_id != null && ctx.bpp_id !== '' ? String(ctx.bpp_id) : DEFAULT_BPP_ID
  const bppUri = ctx?.bpp_uri != null && ctx.bpp_uri !== '' ? String(ctx.bpp_uri) : DEFAULT_BPP_URI

  const req = buildSelectRequest20Generic({
    items: items.map(item => ({
      id: item.id,
      quantity: Number(item.quantity) || 1,
      providerId: item.providerId,
      unitCode: 'KWH',
      unitText: 'Kilowatt Hour',
      orderItemAttributes: {
        port_type: selectedCharger?.selectedPort?.type ?? ''
      }
    })),
    transactionId,
    bppId,
    bppUri,
    domain,
    schemaContext: EV_CHARGING_SCHEMA,
    orderStatus: 'CREATED',
    orderContext: CORE_V2_CONTEXT,
    orderType: 'beckn:Order',
    buyerContext: CORE_V2_CONTEXT,
    buyerType: 'beckn:Buyer',
    buyerRole: 'BUYER',
    buyer: buyer
      ? {
          id: buyer.id,
          displayName: buyer.displayName,
          telephone: buyer.telephone,
          email: buyer.email
        }
      : undefined
  })
  const mapped = mapToPlainKeys(req) as SelectRequest
  if (previousContext && typeof previousContext === 'object' && Object.keys(previousContext).length > 0) {
    mapped.context = {
      ...previousContext,
      action: 'select',
      message_id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      bpp_id:
        previousContext.bpp_id != null && previousContext.bpp_id !== ''
          ? String(previousContext.bpp_id)
          : DEFAULT_BPP_ID,
      bpp_uri:
        previousContext.bpp_uri != null && previousContext.bpp_uri !== ''
          ? String(previousContext.bpp_uri)
          : DEFAULT_BPP_URI
    } as SelectRequest['context']
  }
  ensureBppInContext(mapped as unknown as { context?: Record<string, unknown> })
  return mapped
}

/** Map order with plain keys so common init builder finds fulfillment (beckn:fulfillment) */
function orderPlainToForInit(orderPlain: Record<string, unknown>): Order {
  const order = { ...orderPlain } as Record<string, unknown>
  if (order.fulfillment != null && order['beckn:fulfillment'] === undefined)
    order['beckn:fulfillment'] = order.fulfillment
  return order as unknown as Order
}

export function buildInitRequest20(
  selectResponse: { context: BecknContext; message: { order: Order | Record<string, unknown> } },
  opts: {
    shippingFormData: ShippingFormInitialValuesType
    quantity: string
    fulfillmentId?: string
    fulfillmentType?: string
  }
): InitRequest {
  const order = selectResponse.message.order as Record<string, unknown>
  const selectForCommon = {
    ...selectResponse,
    message: { order: orderPlainToForInit(order) }
  }
  const req = buildInitRequest20Generic(selectForCommon as { context: BecknContext; message: { order: Order } }, {
    customer: {
      name: opts.shippingFormData.name,
      phone: opts.shippingFormData.mobileNumber,
      email: opts.shippingFormData.email,
      address: opts.shippingFormData.address
    },
    quantity: opts.quantity,
    fulfillmentId: opts.fulfillmentId,
    fulfillmentType: opts.fulfillmentType,
    fulfillmentMode: 'EV_CHARGING',
    schemaContext: EV_CHARGING_SCHEMA,
    domain: EV_CHARGING_DOMAIN
  })
  const mapped = mapToPlainKeys(req) as InitRequest
  ensureBppInContext(mapped as unknown as { context?: Record<string, unknown> })
  return mapped
}

/** Map order with plain keys to shape common builder expects (beckn: keys) so it can read orderValue, payment, orderItems */
function orderPlainToForConfirm(orderPlain: Record<string, unknown>): Order {
  const order = { ...orderPlain } as Record<string, unknown>
  if (order.orderValue != null && order['beckn:orderValue'] === undefined) order['beckn:orderValue'] = order.orderValue
  if (order.payment != null && order['beckn:payment'] === undefined) order['beckn:payment'] = order.payment
  if (order.orderItems != null && order['beckn:orderItems'] === undefined) order['beckn:orderItems'] = order.orderItems
  return order as unknown as Order
}

export function buildConfirmRequest20(initResponse: {
  context: BecknContext
  message: { order: Order | Record<string, unknown> }
}): ConfirmRequest {
  const order = initResponse.message.order as Record<string, unknown>
  const initForCommon = {
    ...initResponse,
    message: { order: orderPlainToForConfirm(order) }
  }
  const req = buildConfirmRequest20Generic(initForCommon as { context: BecknContext; message: { order: Order } }, {
    schemaContext: EV_CHARGING_SCHEMA,
    paymentStatus: 'INITIATED',
    paymentContext: CORE_V2_CONTEXT
  })
  const mapped = mapToPlainKeys(req) as ConfirmRequest
  ensureBppInContext(mapped as unknown as { context?: Record<string, unknown> })
  return mapped
}

/** Init/confirm API responses use plain keys (orderValue, orderItems, orderedItem, quantity, id, orderNumber, seller). */

type OrderPlain = Record<string, unknown>

/** Normalize init response (plain keys) to legacy shape for getPaymentBreakDown */
export function normalizeInitResponse20ToLegacy(initResponse: {
  context: BecknContext
  message: { order: OrderPlain }
}): Record<string, unknown> {
  const order = initResponse.message.order
  const orderValue = order.orderValue as
    | {
        value?: number
        currency?: string
        components?: Array<{ type?: string; description?: string; value?: number; currency?: string }>
      }
    | undefined
  const value = Number(orderValue?.value ?? 0)
  const currency = orderValue?.currency ?? 'INR'
  const components = orderValue?.components ?? []
  const orderItems = (order.orderItems ?? []) as OrderPlain[]
  const firstItemId = orderItems?.[0]?.orderedItem
  const breakup = components.map((c: { type?: string; description?: string; value?: number; currency?: string }) => ({
    title: c.description || c.type || 'Item',
    price: { currency: c.currency ?? currency, value: String(c.value ?? 0) },
    item: { id: firstItemId }
  }))
  const items = orderItems.map((oi: OrderPlain) => ({
    id: oi.orderedItem,
    quantity: {
      selected: { measure: { value: String((oi.quantity as { unitQuantity?: number })?.unitQuantity ?? 1) } }
    }
  }))
  return {
    context: {
      ...initResponse.context,
      domain: initResponse.context.domain,
      transaction_id: initResponse.context.transaction_id,
      bpp_id: initResponse.context.bpp_id,
      bpp_uri: initResponse.context.bpp_uri
    },
    message: {
      order: {
        quote: { price: { value, currency }, breakup },
        items
      }
    }
  }
}

/** Normalize confirm response (plain keys) to legacy shape for order confirmation / history */
export function normalizeConfirmResponse20ToLegacy(confirmResponse: {
  context: BecknContext
  message: { order: OrderPlain }
}): Record<string, unknown> {
  const order = confirmResponse.message.order
  const orderValue = order.orderValue as { value?: number; currency?: string } | undefined
  const value = Number(orderValue?.value ?? 0)
  const currency = orderValue?.currency ?? 'INR'
  const orderItems = (order.orderItems ?? []) as OrderPlain[]
  const items = orderItems.map((oi: OrderPlain) => ({
    id: oi.orderedItem,
    name: '',
    quantity: {
      selected: { measure: { value: String((oi.quantity as { unitQuantity?: number })?.unitQuantity ?? 1) } }
    }
  }))
  return {
    context: confirmResponse.context,
    message: {
      orderId: order.id ?? order.orderNumber ?? '',
      provider: { id: order.seller, name: '' },
      items,
      quote: { price: { value: String(value), currency } },
      fulfillments: [],
      payments: []
    }
  }
}
