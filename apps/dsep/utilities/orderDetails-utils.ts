import { ConfirmResponseModel } from '../lib/types/confirm.types'
import { ResponseModel } from '../lib/types/responseModel'
import { StatusData, StatusResponseModel } from '../lib/types/status.types'
import { ShippingFormData } from '../pages/checkoutPage'

const generateRandomID = () => {
  var id = ''

  for (var i = 0; i < 6; i++) {
    var randomDigit = Math.floor(Math.random() * 10)
    id += randomDigit
  }

  return id
}

export const storeOrderDetails = (orderDetails: ResponseModel[]) => {
  const emptyArr = []
  const orders = localStorage.getItem('orders')

  const orderPerId: any = {}
  if (!orders) {
    orderPerId[generateRandomID()] = orderDetails
    emptyArr.push(orderPerId)
    return localStorage.setItem('orders', JSON.stringify(emptyArr))
  }

  orderPerId[generateRandomID()] = orderDetails
  const existingOrders = JSON.parse(orders)
  let updatedOrders = [...existingOrders, orderPerId]

  return localStorage.setItem('orders', JSON.stringify(updatedOrders))
}

export const getDataPerBpp = (confirmData: ResponseModel[]) => {
  const responsesPerBpp: any = {}

  confirmData.map(data => {
    const bppId = data.context.bpp_id
    responsesPerBpp[bppId] = {
      ...data.message.responses[0].message.order
    }
  })

  return responsesPerBpp
}

export const generateAlphanumericID = (function () {
  const length = 6
  const characters = '0123456789'
  let cachedID: any = null

  return function () {
    if (cachedID) {
      return cachedID
    }

    let id = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      id += characters[randomIndex]
    }

    cachedID = id
    return id
  }
})()

export const getStatusPayload = (confirmData: ConfirmResponseModel) => {
  let statusPayload: any = {
    data: []
  }

  confirmData.data.forEach(data => {
    const { transaction_id, bpp_id, bpp_uri, domain } = data.context
    const { orderId } = data.message

    const context = {
      transaction_id,
      bpp_id,
      bpp_uri,
      domain
    }

    const message = {
      order_id: orderId
    }

    statusPayload.data.push({
      context,
      message
    })
  })

  return statusPayload
}

export const getTrackAndSupportPayload = (statusResponse: StatusData) => {
  const { context, message } = statusResponse
  const { domain, bpp_id, bpp_uri, transaction_id } = context
  const {
    order: { id }
  } = message
  const trackPayload = {
    data: [
      {
        context: {
          domain,
          bpp_id,
          bpp_uri,
          transaction_id
        },
        orderId: id
      }
    ]
  }

  const supportPayload = {
    data: [
      {
        context: {
          domain,
          bpp_id,
          bpp_uri,
          transaction_id
        },
        message: {
          order_id: id,
          support: {
            ref_id: id
          }
        }
      }
    ]
  }

  return {
    trackPayload,
    supportPayload
  }
}

export const handleEmailCustomer = (
  email: string,
  setIsMenuModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const subject = 'Regarding Your Order'
  const body = 'Dear Customer,\n\n'

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  window.open(mailtoLink, '_blank')
  setIsMenuModalOpen(false)
}
export const handleCallCustomer = (
  phoneNumber: string,
  setIsMenuModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const telLink = `tel:${phoneNumber}`

  window.open(telLink, '_blank')
  setIsMenuModalOpen(false)
}

export const getUpdatePayload = (formData: ShippingFormData, statusResponse: StatusResponseModel) => {
  const { address, email, mobileNumber, name, pinCode } = formData
  const {
    context: { transaction_id, bpp_id, bpp_uri, domain },
    message: {
      order: { id, fulfillments }
    }
  } = statusResponse.data[0]

  const updatePayload = {
    data: [
      {
        context: {
          transaction_id,
          bpp_id,
          bpp_uri,
          domain
        },
        orderId: id,
        updateDetails: {
          updateTarget: 'order.billing',
          billing: {
            name: name,
            address: address,
            city: {
              name: ''
            },
            state: {
              name: ''
            },
            email: email,
            phone: mobileNumber
          }
        }
      }
    ]
  }

  return updatePayload
}

export const orderCancelReason = [
  { id: '1', reason: 'Instructor is not good' },
  { id: '2', reason: 'Course is not as per my expectation' },
  { id: '3', reason: 'I’ve changed my mind' },
  { id: '4', reason: 'Other' }
]

export const getCancelPayload = (statusResponse: StatusData, cancellationId: string) => {
  const {
    context: { transaction_id, bpp_id, bpp_uri, domain },
    message: {
      order: { id }
    }
  } = statusResponse

  const cancelPayload = {
    data: [
      {
        context: {
          transaction_id,
          bpp_id,
          bpp_uri,
          domain
        },
        message: {
          order_id: id,
          cancellation_reason_id: cancellationId
        }
      }
    ]
  }

  return cancelPayload
}
