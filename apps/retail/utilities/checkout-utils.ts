import { ParsedItemModel } from '../types/search.types'
import { InitResponseModel } from '../types/init.types'
import { StatusResponseModel } from '../types/status.types'
import { CartItemForRequest, CartRetailItem } from '@lib/types'
import { areObjectPropertiesEqual } from './common-utils'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'

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

export const extractAddressComponents = (result: any) => {
  let country = 'IN',
    state = 'Karnataka',
    city = 'Bengaluru'

  for (const component of result.address_components) {
    if (component.types.includes('country')) {
      country = component.short_name
    } else if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (component.types.includes('locality')) {
      city = component.long_name
    }
  }
  return { country, state, city }
}

export const geocodeFromPincode = async (pincode: any) => {
  const geocoder = new window.google.maps.Geocoder()
  try {
    const response = await geocoder.geocode({ address: pincode })
    console.log('respnse from the map', response)
    if (response.results.length > 0) {
      const { country, state, city } = extractAddressComponents(
        response.results[1] ? response.results[1] : response.results[0]
      )
      const lat = response.results[0].geometry.location.lat()
      const lng = response.results[0].geometry.location.lng()
      return { country, state, city, lat, lng }
    } else {
      console.log('No results found')
      return { country: '', state: '', city: '' }
    }
  } catch (error) {
    console.error(error)
    return { country: '', state: '', city: '' }
  }
}

export const getPaymentBreakDown = (initData: InitResponseModel[] | StatusResponseModel[]) => {
  const quote = initData[0].message.order.quote
  const breakUp = quote.breakup
  const totalPricewithCurrent = {
    currency: quote.price.currency,
    value: quote.price.value
  }

  const breakUpMap: Record<string, any> = {}

  breakUp.forEach(item => {
    const {
      title,
      price: { currency, value }
    } = item

    breakUpMap[title] = {
      currency: currency,
      value: value
    }
  })

  return { breakUpMap, totalPricewithCurrent }
}

export const getSubTotalAndDeliveryCharges = (initData: InitResponseModel[]) => {
  let subTotal: number | string = 0
  let currencySymbol

  if (initData && initData.length > 0) {
    initData.forEach(data => {
      subTotal = parseFloat(data.message.order.quote.price.value).toFixed(2)

      currencySymbol = data.message.order.quote.price.currency
    })
  }

  return { subTotal, currencySymbol }
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
  formData: ShippingFormInitialValuesType,
  billingFormData: ShippingFormInitialValuesType
) => {
  if (isBillingAddressComplete) {
    return areObjectPropertiesEqual(formData, billingFormData)
  }
  return !isBillingAddressComplete
}

export const getInitPayload = async (
  deliveryAddress: ShippingFormInitialValuesType,
  billingAddress: ShippingFormInitialValuesType,
  cartItems: CartItemForRequest[],
  transaction_id: string,
  domain: string = 'retail:1.1.0',
  fulfillments: { id: string; type: string } = { id: '3', type: 'Standard-shipping' }
) => {
  const cityData = await geocodeFromPincode(deliveryAddress.pinCode)

  const bppGroups = cartItems.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
    if (!acc[item.bpp_id]) {
      acc[item.bpp_id] = []
    }
    acc[item.bpp_id].push(item)
    return acc
  }, {})

  const data = Object.entries(bppGroups).map(([bpp_id, items]) => {
    return {
      context: {
        transaction_id: transaction_id,
        bpp_id: bpp_id,
        bpp_uri: items[0].bpp_uri,
        domain: domain
      },
      message: {
        orders: transformOrdersByProvider(items, fulfillments)
      }
    }
  })

  function transformOrdersByProvider(items: CartItemForRequest[], fullf: { id: string; type: string }) {
    const providerGroups = items.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
      const providerKey = `${item.bpp_id}_${item.providerId}`
      if (!acc[providerKey]) {
        acc[providerKey] = []
      }
      acc[providerKey].push(item)
      return acc
    }, {})

    return Object.values(providerGroups).map(group => {
      const providerId = group[0].providerId
      const items = group.map(item => ({
        id: item.id,
        quantity: {
          selected: {
            count: item.quantity
          }
        }
      }))

      const fulfillments = [
        {
          id: fullf.id,
          type: fullf.type,
          customer: {
            person: {
              name: deliveryAddress.name
            },
            contact: {
              phone: deliveryAddress.mobileNumber
            }
          },
          stops: [
            {
              location: {
                gps: `${cityData.lat},${cityData.lng}`,
                address: deliveryAddress.address,
                city: {
                  name: cityData?.city
                },
                state: {
                  name: cityData?.state
                },
                country: {
                  code: 'IND'
                },
                area_code: deliveryAddress.pinCode
              },
              contact: {
                phone: deliveryAddress.mobileNumber,
                email: deliveryAddress.email
              }
            }
          ]
        }
      ]

      return {
        provider: {
          id: providerId
        },
        items,
        fulfillments,
        billing: {
          name: billingAddress.name,
          phone: billingAddress.mobileNumber,
          address: billingAddress.address,
          email: billingAddress.email,
          city: {
            name: cityData?.city
          },
          state: {
            name: cityData?.state
          }
        }
      }
    })
  }

  return { data }
}
