/**
 * EV Charging adapter for Beckn 2.0 payload builders.
 * Uses generic builders from @beckn-ui/common and maps EV-specific types (CartItemForRequest, SelectedCharger) to generic options.
 */
import {
  buildSelectRequest20 as buildSelectRequest20Generic,
  buildInitRequest20 as buildInitRequest20Generic,
  buildConfirmRequest20 as buildConfirmRequest20Generic,
  normalizeInitResponse20ToLegacy as normalizeInitResponse20ToLegacyGeneric,
  normalizeConfirmResponse20ToLegacy as normalizeConfirmResponse20ToLegacyGeneric
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

/** Build Beckn 2.0 Select request for EV charging (uses common builder with EV schema and item mapping) */
export function buildSelectRequest20(
  items: CartItemForRequest[],
  transactionId: string,
  selectedCharger: SelectedCharger | null | undefined,
  catalog?: DiscoverCatalogStored | null,
  domain = 'ev-charging'
): SelectRequest {
  if (!items.length) throw new Error('Cart is empty')
  const first = items[0]
  const bppId = first.bpp_id || (catalog && (catalog['beckn:bppId'] as string)) || ''
  const bppUri = first.bpp_uri || (catalog && (catalog['beckn:bppUri'] as string)) || ''

  return buildSelectRequest20Generic({
    items: items.map(item => ({
      id: item.id,
      quantity: Number(item.quantity) || 1,
      providerId: item.providerId,
      unitCode: 'KWH',
      orderItemAttributes: {
        port_type: selectedCharger?.selectedPort?.type ?? ''
      }
    })),
    transactionId,
    bppId,
    bppUri,
    domain,
    schemaContext: EV_CHARGING_SCHEMA,
    orderStatus: 'CONFIRMED'
  })
}

/** Build Beckn 2.0 Init request for EV charging (uses common builder with EV fulfillment mode) */
export function buildInitRequest20(
  selectResponse: { context: BecknContext; message: { order: Order } },
  opts: {
    shippingFormData: ShippingFormInitialValuesType
    quantity: string
    fulfillmentId?: string
    fulfillmentType?: string
  }
): InitRequest {
  return buildInitRequest20Generic(selectResponse, {
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
    schemaContext: EV_CHARGING_SCHEMA
  })
}

/** Build Beckn 2.0 Confirm request for EV charging (uses common builder) */
export function buildConfirmRequest20(initResponse: {
  context: BecknContext
  message: { order: Order }
}): ConfirmRequest {
  return buildConfirmRequest20Generic(initResponse, {
    schemaContext: EV_CHARGING_SCHEMA,
    acceptedPaymentMethods: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET']
  })
}

/** Re-export normalizers from common (same signature) */
export const normalizeInitResponse20ToLegacy = normalizeInitResponse20ToLegacyGeneric
export const normalizeConfirmResponse20ToLegacy = normalizeConfirmResponse20ToLegacyGeneric
