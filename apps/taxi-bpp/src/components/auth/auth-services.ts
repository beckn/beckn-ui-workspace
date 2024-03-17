'use client'

import { getRequestData, postRequestData } from '@/lib/apiClient'
import { setApiKey, setUser } from '@/lib/common.functions'
import { UserFields } from '@/lib/fieldsSet'

export const getCompanies = (path: any, fields: any) => {
  return getRequestData(path, fields, null)
}

export const getRoles = (path: any, fields: any) => {
  return getRequestData(path, fields, null)
}

export const userAction = async (path: any, data: any, fields: any) => {
  const logRes = await postRequestData(path, data, fields)
  setApiKey(logRes.data.User)
  let userUrl = `users/show/${logRes.data.User.Id}`
  let fieldset = `{"User":["Name","DateOfBirth","Id","AddressLine1","AddressLine2","AddressLine3","CityId","FirstName","LastName","PhoneNumber","PinCodeId","Verified"],"DriverDocument":["Id","Document","ImageUrl","DocumentNumber","Verified"]}`
  const getUser = await getRequestData(userUrl, UserFields, null)

  setUser(getUser.data.User)
  if (data.User.UserRole) {
    let roleUrl = 'user_roles/save'
    let roleData = {
      UserRole: {
        UserId: logRes.data.User.Id,
        Role: data.User.UserRole
      }
    }
    return await postRequestData(roleUrl, roleData, null)
  } else {
    return logRes.data.User
  }
}

export const userLogin = (path: any, data: any, fields: any) => {
  return postRequestData(path, data, fields)
}

export const userLogout = (path: any, fields: any) => {
  return getRequestData(path, fields, null)
}
