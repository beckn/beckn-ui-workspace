import { CartRetailItem, DataPerBpp } from '@lib/types/cart'
import { ShippingFormData } from '.'
import { areObjectPropertiesEqual } from '@utils/common-utils'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'

export const getPayloadForInitRequest = (
  cartItemsPerBppPerProvider: DataPerBpp,
  transactionId: { transactionId: string },
  customerAddress: ShippingFormInitialValuesType,
  billingFormData: ShippingFormInitialValuesType
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
              area_code: customerAddress.pinCode
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

export const getSubTotalAndDeliveryCharges = (initData: any) => {
  let subTotal = 0
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
  formData: ShippingFormData,
  billingFormData: ShippingFormData
) => {
  if (isBillingAddressComplete) {
    return areObjectPropertiesEqual(formData, billingFormData)
  }
  return !isBillingAddressComplete
}

const extractAddressComponents = (result: any) => {
  let country = null,
    state = null,
    city = null

  for (const component of result.address_components) {
    if (component.types.includes('country')) {
      country = component.long_name
    } else if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (component.types.includes('locality')) {
      city = component.long_name
    }
  }
  return { country, state, city }
}

const geocodeFromPincode = async (pincode: any) => {
  const geocoder = new window.google.maps.Geocoder()
  try {
    const response = await geocoder.geocode({ address: pincode })
    console.log('Dank', response)
    if (response.results.length > 0) {
      const { country, state, city } = extractAddressComponents(response.results[0])
      const lat = response.results[0].geometry.location.lat()
      const lng = response.results[0].geometry.location.lng()
      return { country, state, city, lat, lng }
    } else {
      console.log('No results found')
    }
  } catch (error) {
    console.error(error)
  }
}

export const getInitPayload = async (
  deliveryAddress: any,
  billingAddress: any,
  cartItems: any,
  transaction_id: string,
  domain: string = 'retail:1.1.0',
  selectResponse: any
) => {
  const cityData = await geocodeFromPincode(deliveryAddress.pinCode)

  let initPayload: any = {
    data: []
  }

  selectResponse.forEach((res: any) => {
    const { transaction_id, bpp_id, bpp_uri, domain } = res.context
    const { order } = res.message
    const { items, provider, type, quote, fulfillments } = order
    const { id, type: fulfillmentType } = fulfillments[0]
    const { id: providerId } = provider

    const context = {
      transaction_id,
      bpp_id,
      bpp_uri,
      domain
    }

    const message = {
      orders: [
        {
          provider: {
            id: providerId
          },
          items: items,
          fulfillments: [
            {
              id: id,
              type: fulfillmentType,
              customer: {
                contact: {
                  email: deliveryAddress.email,
                  mobileNumber: deliveryAddress.mobileNumber
                },
                person: {
                  name
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
          ],
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
      ]
    }

    initPayload.data.push({
      context: context,
      message: message
    })
  })

  // return { data }
  return initPayload
}
