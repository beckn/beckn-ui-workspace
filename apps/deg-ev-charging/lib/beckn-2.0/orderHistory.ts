/**
 * Beckn 2.0 order history payload for EV Charging.
 * Builds payload for order-history API from normalized confirm response.
 */
import type { ConfirmResponseModel, QuantityDetails } from '@beckn-ui/common'

export function getPayloadForOrderHistoryPost(
  confirmData: ConfirmResponseModel[],
  categoryId: number
): { data: Array<Record<string, unknown>> } {
  const ordersPayload = confirmData.map(({ context, message }) => ({
    context: {
      bpp_id: context.bpp_id,
      bpp_uri: context.bpp_uri,
      transaction_id: context.transaction_id
    },
    message: {
      order: {
        id: message.orderId,
        provider: {
          id: message.provider.id,
          descriptor: {
            name: message.provider.name,
            short_desc: message.provider.short_desc
          }
        },
        items: message.items,
        fulfillments: message.fulfillments,
        quote: {
          price: {
            currency: message.quote.price.currency,
            value:
              parseFloat(message.quote.price.value) *
              parseFloat((message.items?.[0]?.quantity as QuantityDetails)?.selected?.measure?.value ?? '1')
          }
        },
        payments: message.payments
      }
    },
    category: categoryId
  }))

  return { data: ordersPayload }
}
