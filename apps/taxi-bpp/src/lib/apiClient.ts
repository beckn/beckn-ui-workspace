import axios from 'axios'
import { config } from '../config/config'
import { spinnerService } from '@simply007org/react-spinners'
import { toast } from 'react-toastify'
import { LocalKey, AppRoutes, NoLoaderPath, NoLoader } from './constant'
import { removeCookie } from './CookiesHandler'
import { setUser } from './common.functions'
import { UserFields } from './fieldsSet'
const apiBaseURL = config.API_BASE_URL

export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
})

const getErrorMessage = function getErrorMessage(error: any) {
  const errorTxt =
    error && error.response && error.response.data
      ? error.response.data.SWFHttpResponse.Error
      : 'Oops! Something Went Wrong, Please Try Again Later.'
  return errorTxt
}

// 'Accept-Encoding': 'gzip'
const isHandlerEnabled = (config = {} as any) => {
  // no-prototype-builtins
  return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled ? false : true
}

const errorHandler = (error: any) => {
  if (isHandlerEnabled(error.config)) {
    if (error.response.status === 401) {
      removeCookie(LocalKey.saveApi)
      removeCookie(LocalKey.saveUser)
      window.location.href = AppRoutes.admin
    }
    // Handle errors
    spinnerService.hide(LocalKey.spinnerKey)
    toast.error(getErrorMessage(error), {
      toastId: 1
    })
  }
  return Promise.reject({ ...error })
}

const successHandler = (response: any) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
    spinnerService.hide(LocalKey.spinnerKey)
  }
  return response
}

const requestHandler = (request: any) => {
  if (isHandlerEnabled(request)) {
    const URL = request.url
    const isShowLoader = URL.includes(NoLoaderPath)
    if (request.url && !NoLoader.includes(request.url.split('?')[0]) && !isShowLoader)
      spinnerService.show(LocalKey.spinnerKey)
    // Modify request here
    if (window.localStorage.getItem(LocalKey.saveApi) && request.url !== 'login') {
      request.headers['ApiKey'] = JSON.parse(window.localStorage.getItem(LocalKey.saveApi) as string).ApiKey
    }
  }
  return request
}

axiosInstance.interceptors.request.use(request => requestHandler(request))

axiosInstance.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error) //will activate after invistigation of sign-in page
)

// Get data request
export const getRequestData = (paths: any, fieldsList: any, location: any) => {
  let data: any = {
    data: {}
  }
  if (fieldsList) {
    const encodedHeader = btoa(fieldsList)
    data = {
      ...data.data,
      headers: {
        IncludedModelFields: encodedHeader
      }
    }
  }
  if (location) {
    data = {
      ...data.data,
      headers: {
        ...(fieldsList && {
          IncludedModelFields: data.headers.IncludedModelFields
        }),
        'X-Lat': location.latitude || 2.3,
        'X-Lng': location.longitude || 4.5
      }
    }
  }
  return axiosInstance.get(paths, data)
}

// Post data request
export const postRequestData = (paths: any, data: any, fieldsList: any) => {
  let headers = {}
  if (fieldsList) {
    const encodedHeader = btoa(fieldsList)
    headers = {
      headers: {
        IncludedModelFields: encodedHeader
      }
    }
  }
  return axiosInstance.post(paths, data, headers)
}

const makeAgent = async (id: any) => {
  const roleUrl = 'user_roles/save'
  const roleData = {
    UserRole: {
      UserId: id,
      Role: {
        Id: '1'
      }
    }
  }
  return await postRequestData(roleUrl, roleData, null)
}

export const getUser = async (UserId: any, roleType = 'driver') => {
  const userUrl = `users/show/${UserId}`
  const getUser = await getRequestData(userUrl, UserFields, null)
  setUser(getUser.data.User)
  if (roleType != 'driver') {
    getUser && window.location.reload()
  }
}

export const userSave = (path: any, data: any, fieldsList: any, IsStoreUpdate: any, roleType: any) => {
  return postRequestData(path, data, fieldsList).then(res => {
    roleType === 'agent' && makeAgent(res.data.Users[0].Id)
    IsStoreUpdate && getUser(res.data.Users[0].Id, roleType)
    return res
  })
}
