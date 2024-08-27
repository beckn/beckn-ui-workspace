import { CartRetailItem } from '../lib/types/cart'
import { InitResponseItem, InitResponseModel } from '../lib/types/init.types'
import { ResponseModel } from '../lib/types/responseModel'
import { SelectResponseModel } from '../lib/types/select.types'
import { ShippingFormData } from '../pages/checkoutPage'
import axios from '../services/axios'
import { areObjectPropertiesEqual } from './common-utils'

const APIKEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string

export const getSubTotalAndDeliveryCharges = (initData: (ResponseModel & ResponseModel[]) | null) => {
  let subTotal = 0
  const totalDeliveryCharge = 0

  if (initData) {
    initData.forEach(data => {
      const deliveryAmount = parseFloat(
        data.message.catalogs.responses[0].message.order.quote.breakup[1].price.value
      ).toFixed(2)

      const subTotalAmount = parseFloat(
        data.message.catalogs.responses[0].message.order.quote.breakup[0].price.listed_value
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

const extractAddressComponents = (result: any) => {
  let country = 'IN',
    state = 'Karnataka',
    city = 'Bengaluru'

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
async function addressComponentsFromPincode(pincode: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${APIKEY}`
    const response = await axios.get(url)

    const { country, state, city } = extractAddressComponents(response.data.results[0])

    return { country, state, city }
  } catch (error) {
    console.error('Failed to geocode the pindcode', error)
  }
}

export const getPayloadForInitRequest = async (selectResponse: SelectResponseModel, formData: ShippingFormData) => {
  const { address, email, mobileNumber, name, pinCode } = formData
  const cityData = await addressComponentsFromPincode(pinCode)
  const initPayload: any = {
    data: []
  }

  selectResponse.data.forEach(res => {
    const { transaction_id, bpp_id, bpp_uri, domain } = res.context
    const { order } = res.message
    const { items, provider, type, quote } = order
    const { id: providerId } = provider
    console.log(items)
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
              id: items[0]?.fulfillments[0]?.id,
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
          billing: {
            name,
            address,
            state: {
              name: cityData?.state
            },
            city: {
              name: cityData?.city
            },
            email,
            phone: mobileNumber
          }
        }
      ]
    }

    initPayload.data.push({
      context: context,
      message: message
    })
  })
  return initPayload
}

export const handleFormSubmit = async (
  formData: ShippingFormData,
  selectResponse: SelectResponseModel,
  setInitData: React.Dispatch<React.SetStateAction<InitResponseModel | null>>,
  setIsLoadingForInit: React.Dispatch<React.SetStateAction<boolean>>,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  apiUrl: string
) => {
  setIsLoadingForInit(true)
  try {
    const initPayload = await getPayloadForInitRequest(selectResponse, formData)
    axios
      .post(`${apiUrl}/init`, initPayload)
      .then(res => {
        localStorage.setItem('initResult', JSON.stringify(res.data))
        setInitData(res.data)
        setIsLoadingForInit(false)
      })
      .catch(e => {
        setIsError(true)
        setIsLoadingForInit(false)
        console.error(e)
      })
  } catch (error) {
    console.error(error)
  }
}

export const getPaymentBreakDown = (initData: InitResponseItem) => {
  const { message } = initData
  const { order } = message
  const { quote } = order
  const { breakup, price } = quote

  const totalPricewithCurrent = {
    currency: price.currency,
    value: breakup.reduce((total, item) => {
      return total + parseFloat(item.price.value)
    }, 0)
  }

  const breakUpMap: Record<string, any> = {}
  breakup.forEach(item => {
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
