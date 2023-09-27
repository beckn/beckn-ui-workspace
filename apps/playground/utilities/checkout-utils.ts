import { CartRetailItem, DataPerBpp } from '../lib/types/cart'
import { ResponseModel } from '../lib/types/responseModel'
import { ShippingFormData } from '../pages/checkoutPage'
import { areObjectPropertiesEqual } from './common-utils'

export const getPayloadForInitRequest = (
  cartItemsPerBppPerProvider: DataPerBpp,
  transactionId: { transactionId: string },
  customerAddress: ShippingFormData,
  billingFormData: ShippingFormData
) => {
  const payload: any = {
    initRequestDto: []
  }

  Object.keys(cartItemsPerBppPerProvider).forEach(bppId => {
    const cartItem: any = {
      context: {
        transaction_id: transactionId.transactionId,
        bpp_id: bppId,
        bpp_uri: cartItemsPerBppPerProvider[bppId][0].bpp_uri,
        domain: 'retail'
      },
      message: {
        order: {
          items: [],
          provider: {
            id: cartItemsPerBppPerProvider[bppId][0].providerId,
            locations: [
              {
                id: cartItemsPerBppPerProvider[bppId][0].location_id
              }
            ]
          },
          addOns: [],
          offers: [],
          billing: {
            name: customerAddress.name,
            phone: customerAddress.mobileNumber,
            address: {
              door: '',
              building: customerAddress.address,
              city: customerAddress.address,
              state: customerAddress.address,
              country: 'IND',
              area_code: customerAddress.zipCode
            },
            email: 'testemail1@mailinator.com'
          },
          fulfillment: {
            type: 'HOME-DELIVERY',
            end: {
              location: {
                gps: cartItemsPerBppPerProvider[bppId][0].locations[0].gps,
                address: {
                  door: '',
                  building: customerAddress.address,
                  street: customerAddress.address,
                  city: customerAddress.address,
                  state: customerAddress.address,
                  country: 'IND',
                  area_code: '560076'
                }
              },
              contact: {
                phone: '9191223433',
                email: 'testemail1@mailinator.com'
              }
            },
            customer: {
              person: {
                name: customerAddress.name
              }
            },
            id: cartItemsPerBppPerProvider[bppId][0].providerId
          }
        }
      }
    }
    cartItemsPerBppPerProvider[bppId].forEach((item: any) => {
      if (item.bpp_id === bppId) {
        const itemObject = {
          quantity: {
            count: item.quantity
          },
          id: item.id
        }
        cartItem.message.order.items.push(itemObject)
      }
    })
    payload.initRequestDto.push(cartItem)
  })
  return payload
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

export const areShippingAndBillingDetailsSame = (
  isBillingAddressComplete: boolean,
  formData: ShippingFormData,
  billingFormData: ShippingFormData
) => {
  if (isBillingAddressComplete) {
    return areObjectPropertiesEqual(formData, billingFormData)
  }
  return !isBillingAddressComplete
}
