import { ResponseModel } from '../lib/types/responseModel'

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

  const orderPerId = {}
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
  const responsesPerBpp = {}

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
