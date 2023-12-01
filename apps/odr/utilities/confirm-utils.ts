import { ResponseModel } from '../lib/types/responseModel'

export const getPayloadForConfirmRequest = (initResponse: ResponseModel, transactionId: any) => {
  const payload: any = {}

  payload.context = {
    transactionId: initResponse.context.transactionId,
    bppId: initResponse?.context?.bppId,
    bppUri: initResponse?.context?.bppUri
  }

  payload.scholarshipProvider = {
    id: initResponse?.scholarshipProvider?.id,
    name: initResponse?.scholarshipProvider?.name,
    description: initResponse?.scholarshipProvider?.shortDesc,
    scholarships: [
      {
        id: initResponse?.scholarshipProvider?.scholarships[0]?.id,
        name: initResponse?.scholarshipProvider?.scholarships[0]?.name,
        description: '',
        categoryId: '',
        amount: {
          amount: 30000,
          currency: 'INR'
        },
        scholarshipDetails: {
          id: initResponse?.scholarshipProvider?.scholarships[0]?.id,
          type: 'SCHOLARSHIP',
          applicationEndDate: '2023-03-31T00:00:00.000Z',
          applicationStartDate: '2023-01-01T00:00:00.000Z',
          supportContact: {
            //it should be initResponse?.scholarshipProvider?.scholarships[0]?.scholarshipDetails.supportContact
            name: 'Mary G',
            phone: '9876543210',
            email: 'maryg@xyz.com'
          },
          scholarshipRequestor: {
            name: transactionId.customerDetails.name,
            phone: transactionId.customerDetails.mobileNumber,
            address: transactionId.customerDetails.address
          }
        }
      }
    ]
  }

  return payload
}
export const getOrderPlacementTimeline = (timeStamp: string) => {
  const localDateAndTime = new Date(timeStamp)
  const localTime = localDateAndTime.toLocaleTimeString()
  const localDate = localDateAndTime.toDateString()
  const localDateWithoutDay = localDate.split(' ').slice(1).join(' ')

  return `${localDateWithoutDay}, ${localTime}`
}

export function convertTimestampToDdMmYyyyHhMmPM(timestamp: string) {
  const date = new Date(timestamp)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  let hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const ampm = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  if (hour === 0) {
    hour = 12
  }

  const formattedTimestamp = `${day}/${month}/${year}, ${hour}:${minute} ${ampm}`

  return formattedTimestamp
}
