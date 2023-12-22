import { CartRetailItem, DataPerBpp } from '../lib/types/cart'
import { ResponseModel } from '../lib/types/responseModel'
import { areObjectPropertiesEqual } from './common-utils'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { ParsedItemModel } from '../types/search.types'
import { SelectResponseModel } from '../types/select.types'

export const getPayloadForSelectRequest = (selectedProduct: ParsedItemModel) => {
  const {
    bppId,
    bppUri,
    transactionId,
    domain,
    providerId,
    item: { id, fulfillments, tags }
  } = selectedProduct

  const selectPayload = {
    data: [
      {
        context: {
          transaction_id: transactionId,
          bpp_id: bppId,
          bpp_uri: bppUri,
          domain: domain
        },
        message: {
          orders: [
            {
              provider: {
                id: providerId
              },
              items: [
                {
                  id
                }
              ],
              fulfillments,
              tags: [
                {
                  descriptor: {
                    name: 'select-1'
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }

  return selectPayload
}

export const getPayloadForInitRequest = (selectData: ParsedItemModel) => {
  const { providerId, bppId, bppUri, domain, transactionId, item } = selectData
  const { fulfillments } = item

  const initPayload = {
    data: [
      {
        context: {
          transaction_id: transactionId,
          bpp_id: bppId,
          bpp_uri: bppUri,
          domain: domain
        },
        message: {
          orders: [
            {
              provider: {
                id: providerId
              },
              items: [item],
              fulfillments: fulfillments,
              billing: {
                name: 'Industry buyer',
                address: 'B005 aspire heights, Jurong East, SGP, 680230',
                state: {
                  name: 'Jurong East'
                },
                city: {
                  name: 'Jurong East'
                },
                email: 'nobody@nomail.com',
                phone: '9886098860'
              }
            }
          ]
        }
      }
    ]
  }

  return initPayload
}

export const getSubTotalAndDeliveryCharges = (initData: (ResponseModel & ResponseModel[]) | null) => {
  let subTotal = 0
  let totalDeliveryCharge = 0

  if (initData) {
    initData.forEach(data => {
      const deliveryAmount = parseFloat(
        data.message.catalogs.responses[0].message.order.quote.breakup[1].price.value
      ).toFixed(2)
      totalDeliveryCharge += parseFloat(deliveryAmount)

      const subTotalAmount = parseFloat(
        data.message.catalogs.responses[0].message.order.quote.breakup[0].price.value
      ).toFixed(2)

      subTotal += parseFloat(parseFloat(subTotalAmount).toFixed(2))
    })
  }

  return { subTotal, totalDeliveryCharge }
}

export const getTotalCartItems = (cartItems: CartRetailItem[]) => {
  let quantity = 0

  cartItems.forEach(item => {
    quantity += item.quantity
  })

  return quantity
}

// export const areShippingAndBillingDetailsSame = (
//   isBillingAddressComplete: boolean,
//   formData: ShippingFormData,
//   billingFormData: ShippingFormData
// ) => {
//   if (isBillingAddressComplete) {
//     return areObjectPropertiesEqual(formData, billingFormData)
//   }
//   return !isBillingAddressComplete
// }
