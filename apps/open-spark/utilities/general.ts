import { DocumentPayload } from '@lib/types/becknDid'

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

export const getMaskedMobileNumber = (phoneNumber: string) => {
  return `+91 ${phoneNumber.slice(0, 2)}XXXX${phoneNumber.slice(-3)}`
}

export const extractMobileNumberFromSubjectDid = (subject: string) => {
  if (!subject && subject === '') return
  const didRegex = /\/subjects\/(?:users|phone)\/phone\/(\d+)/
  const match = subject.match(didRegex)

  return match?.[1]
}

export const toSnakeCase = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '_')
}

export const toBase64 = (inputString: string): string => {
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(inputString)))
  } else {
    return Buffer.from(inputString, 'utf-8').toString('base64')
  }
}

export const fromBase64 = (base64String: string): string => {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(atob(base64String)))
  } else {
    return Buffer.from(base64String, 'base64').toString('utf-8')
  }
}

export const extractAuthAndHeader = (
  inputString: string
): { authorization: string | null; payload: DocumentPayload } => {
  const authMatch = inputString.match(/Authorization=(.*?),\s*payload/)
  const payloadMatch = inputString.match(/payload=(.*?})\s*}/)
  if (authMatch && authMatch?.length > 0 && payloadMatch && payloadMatch?.length > 0) {
    const authorization = authMatch?.[1].trim()
    const payload: any = payloadMatch?.[1]

    return { authorization: authorization!, payload: payload }
  } else {
    return { authorization: null, payload: { name: '', stream: '' } }
  }
}

export const filterByKeyword = (data: any[], keyword: string, searchBy: string): any[] => {
  if (!keyword.trim()) return data

  return data.filter(item => item[searchBy].toLowerCase().includes(keyword.toLowerCase()))
}

export const validateStartEndTime = (startTime: Date, endTime: Date): boolean => {
  return startTime.getTime() < endTime.getTime()
}
