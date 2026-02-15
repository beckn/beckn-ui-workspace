/**
 * Beckn 2.0 payload builders for EV Charging.
 * Single source for select/init/confirm requests and normalizers.
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

const CORE_V2_CONTEXT =
  'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/core/v2/context.jsonld'

/** Domain for DEG EV Charging (beckn.one:deg:ev-charging:*) */
export const EV_CHARGING_DOMAIN = 'beckn.one:deg:ev-charging:*'

export interface SelectBuyerInput {
  id?: string
  displayName?: string
  telephone?: string
  email?: string
}

export function buildSelectRequest20(
  items: CartItemForRequest[],
  transactionId: string,
  selectedCharger: SelectedCharger | null | undefined,
  catalog?: DiscoverCatalogStored | null,
  domain = EV_CHARGING_DOMAIN,
  buyer?: SelectBuyerInput | null
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
}

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
    schemaContext: EV_CHARGING_SCHEMA,
    domain: EV_CHARGING_DOMAIN
  })
}

export function buildConfirmRequest20(initResponse: {
  context: BecknContext
  message: { order: Order }
}): ConfirmRequest {
  return buildConfirmRequest20Generic(initResponse, {
    schemaContext: EV_CHARGING_SCHEMA,
    paymentStatus: 'INITIATED',
    paymentContext: CORE_V2_CONTEXT
  })
}

export const normalizeInitResponse20ToLegacy = normalizeInitResponse20ToLegacyGeneric
export const normalizeConfirmResponse20ToLegacy = normalizeConfirmResponse20ToLegacyGeneric
