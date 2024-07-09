import { v4 as uuidv4 } from 'uuid'
import { DataState } from '../../../../lib/types'

export const getTrackSupportOrderPayload = (confirmData: any, selectedOrderData: any, statusResponseData: any) => {
  const commonContext = {
    domain: confirmData ? confirmData[0].context.domain : statusResponseData[0].context.domain,
    bpp_id: confirmData ? confirmData[0].context.bpp_id : selectedOrderData.bppId,
    bpp_uri: confirmData ? confirmData[0].context.bpp_uri : selectedOrderData.bppUri
  }
  const orderId = confirmData ? confirmData[0].message.orderId : selectedOrderData.orderId

  return {
    trackPayload: {
      data: [
        {
          context: { ...commonContext, transaction_id: uuidv4() },
          orderId,
          callbackUrl: 'https://dhp-network-bap.becknprotocol.io/track/callback'
        }
      ]
    },
    supportPayload: {
      data: [
        {
          context: { ...commonContext, transaction_id: uuidv4() },
          message: {
            order_id: orderId,
            support: {
              callback_phone: '+91-8858150053',
              ref_id: '894789-43954',
              phone: '+91 9988776543',
              email: 'supportperson@gmail.com'
            }
          }
        }
      ]
    }
  }
}

export const getCancelPayload = (context: any, orderId: string, cancellationReason: string) => ({
  data: [
    {
      context: {
        transaction_id: uuidv4(),
        bpp_id: context.bpp_id,
        bpp_uri: context.bpp_uri,
        domain: context.domain
      },
      message: {
        order_id: orderId,
        cancellation_reason_id: '4',
        descriptor: {
          short_desc: cancellationReason
        }
      }
    }
  ]
})

export const extractOrderDetails = (data: DataState) => {
  const { order } = data.statusData[0]?.message

  const {
    billing: { address: billingAddress, name: billingName, phone: billingPhone },
    fulfillments,
    created_at,
    quote: { breakup, price }
  } = order

  const {
    customer: {
      contact: { phone: shippingPhone },
      person: { name: shippingName }
    },
    stops
  } = fulfillments[0]

  const {
    location: { address: shipmentAddress },
    contact: { phone: updateShippingPhone, email: updatedShippingEmail, name: updatedShippingName }
  } = stops[0]

  return {
    billingAddress,
    billingName,
    billingPhone,
    created_at,
    breakup,
    price,
    shippingPhone,
    shippingName,
    shipmentAddress,
    updateShippingPhone,
    updatedShippingEmail,
    updatedShippingName
  }
}
