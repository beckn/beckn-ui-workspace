import { postRequestData, getUser, getRequestData } from '@/lib/apiClient'

export const uploadFile = (path: any, data: any, fields: any, isUserUpdate: any) => {
  return postRequestData(path, data, fields).then(res => {
    isUserUpdate && getUser(res.data.DriverDocument.Driver.Id, 'driver')
    return res
  })
}

export const getAutoCompleteValues = (searchGroup: any, val: any, section: any) => {
  return getRequestData(`${section ? section : 'user'}/${searchGroup}/search?q=${val}`, null, null)
}

export const getDocumentSave = (path: any, data: any, fields: any) => {
  return postRequestData(path, data, fields)
}
