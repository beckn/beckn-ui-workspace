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
        initRequestDto: [],
    }

    const {
        address,
        city,
        country,
        email,
        mobileNumber,
        name,
        zipCode,
        state,
    } = billingFormData
    const {
        address: shippingAddress,
        city: shippingCity,
        country: shippingCountry,
        email: shippingEmail,
        mobileNumber: shippingMob,
        name: shippingName,
        zipCode: shippingZipCode,
        state: shippingState,
    } = customerAddress

    Object.keys(cartItemsPerBppPerProvider).forEach((bppId) => {
        const cartItem: any = {
            context: {
                transaction_id: transactionId.transactionId,
                bpp_id: bppId,
                bpp_uri: cartItemsPerBppPerProvider[bppId][0].bpp_uri,
                domain: 'retail',
            },
            message: {
                order: {
                    items: [],
                    provider: {
                        id: cartItemsPerBppPerProvider[bppId][0].providerId,
                        locations: [
                            {
                                id: cartItemsPerBppPerProvider[bppId][0]
                                    .location_id,
                            },
                        ],
                    },
                    addOns: [],
                    offers: [],

                    billing: {
                        name,
                        phone: mobileNumber,
                        address: {
                            door: address,
                            building: '',
                            city: city,
                            state: state,
                            country: country,
                            area_code: zipCode,
                        },
                        email: email,
                    },
                    fulfillment: {
                        type: 'HOME-DELIVERY',
                        end: {
                            location: {
                                gps: '48.85041854,2.343660801',
                                address: {
                                    door: shippingAddress,
                                    building: '',
                                    street: '',
                                    city: shippingCity,
                                    state: shippingState,
                                    country: shippingCountry,
                                    area_code: shippingZipCode,
                                },
                            },
                            contact: {
                                phone: shippingMob,
                                email: shippingEmail,
                            },
                        },
                        customer: {
                            person: {
                                name: shippingName,
                            },
                        },
                        id: cartItemsPerBppPerProvider[bppId][0].providerId,
                    },
                },
            },
        }
        cartItemsPerBppPerProvider[bppId].forEach((item: any) => {
            if (item.bpp_id === bppId) {
                const itemObject = {
                    quantity: {
                        count: item.quantity,
                    },
                    id: item.id,
                }
                cartItem.message.order.items.push(itemObject)
            }
        })
        payload.initRequestDto.push(cartItem)
    })
    return payload
}

export const getSubTotalAndDeliveryCharges = (
    initData: (ResponseModel & ResponseModel[]) | null
) => {
    let subTotal = 0
    let totalDeliveryCharge = 0
    let totalOrderPrice = 0

    if (initData) {
        initData.forEach((data) => {
            const deliveryAmount = parseFloat(
                data.message.catalogs.responses[0].message.order.quote
                    .breakup[1].price.listed_value
            ).toFixed(2)
            totalDeliveryCharge += parseFloat(deliveryAmount)

            const subTotalAmount = parseFloat(
                data.message.catalogs.responses[0].message.order.quote
                    .breakup[0].price.listed_value
            ).toFixed(2)

            subTotal += parseFloat(parseFloat(subTotalAmount).toFixed(2))
        })
    }
    totalOrderPrice = subTotal + totalDeliveryCharge

    return { subTotal, totalDeliveryCharge, totalOrderPrice }
}

export const getTotalCartItems = (cartItems: CartRetailItem[]) => {
    let quantity = 0

    cartItems.forEach((item) => {
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
