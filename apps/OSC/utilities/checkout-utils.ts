import { ParsedItemModel } from '../types/search.types'
import { InitResponseModel } from '../types/init.types'
import { StatusResponseModel } from '../types/status.types'

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

const extractAddressComponents = (result: any) => {
  let country = null,
    state = null,
    city = null

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
      const { country, state, city } = extractAddressComponents(response.results[0])
      return { country, state, city }
    } else {
      console.log('No results found')
    }
  } catch (error) {
    console.error(error)
  }
}

export const getPayloadForInitRequest = async (selectData: ParsedItemModel, shippingDetails: any, billingData: any) => {
  try {
    const { providerId, bppId, bppUri, domain, transactionId, item } = selectData
    const { fulfillments } = item
    const { name, address, email, mobileNumber, pinCode } = shippingDetails
    const {
      name: billingname,
      address: billingAddress,
      email: billingEmail,
      mobileNumber: billingMobileNumber,
      pinCode: billingPinCode
    } = billingData

    const cityData = await geocodeFromPincode(pinCode)

    console.log('geocodeFromPincode(pinCode)', cityData)

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
                fulfillments: [
                  {
                    id: fulfillments[0].id,
                    customer: {
                      contact: {
                        email,
                        mobileNumber
                      },
                      person: {
                        name
                      }
                    },
                    stops: [
                      {
                        type: 'end',
                        location: {
                          gps: '1.3806217468119772, 103.74636438437074',
                          address: address,
                          city: {
                            name: cityData?.city
                          },
                          country: {
                            code: ''
                          },
                          area_code: pinCode,
                          state: {
                            name: cityData?.state
                          }
                        },
                        contact: {
                          phone: mobileNumber
                        }
                      }
                    ]
                  }
                ],
                // fulfillments: fulfillments,
                billing: {
                  name: billingname,
                  address: billingAddress,
                  state: {
                    name: cityData?.state
                  },
                  city: {
                    name: cityData?.city
                  },
                  email: billingEmail,
                  phone: billingMobileNumber
                }
              }
            ]
          }
        }
      ]
    }

    return initPayload
  } catch (error) {
    console.error(error)
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
