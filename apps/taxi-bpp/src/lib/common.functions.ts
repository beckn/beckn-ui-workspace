import { VehicleTags } from './shared/constant'
import { AppRoutes, LocalKey } from './constant'
import { getCookie, setCookie } from './CookiesHandler'
// TODO :- have to add this in the components folder and then restore this
// import { triggerEvent } from '../components/DriverApp/components/SwitchButton/driver.Services'

// @typescript-eslint/no-explicit-any
export const setValue: any = (propertyPath: any, value: any, obj: any) => {
  const properties = Array.isArray(propertyPath) ? propertyPath : propertyPath.split('.')

  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== 'object') obj[properties[0]] = {}
    return setValue(properties.slice(1), value, obj[properties[0]])
  } else {
    // We set the value to the last property
    obj[properties[0]] = value
    return true // this is the end
  }
}

export const getValue = (propertyPath: any, obj: any) => {
  const properties = Array.isArray(propertyPath) ? propertyPath : propertyPath.split('.')
  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== 'object') obj[properties[0]] = {}
    return setValue(properties.slice(1), obj[properties[0]], null)
  } else {
    // We set the value to the last property
    return obj[properties[0]] // this is the end
  }
}

//TODO :- To check for the naviage code here. Navigation is different for next js
export const isAuthenticated = (router: any) => {
  if (getCookie(LocalKey.saveApi)) {
    // triggerEvent('mbth_login')
    //window.location.href = AppRoutes.driverDashboard;
    router.push('/dashboard')
  }
}

export const getAddress = function getAddress(address: any) {
  let userAddress: any = []
  if (
    address.AddressLine1 &&
    (address.City.State ? address.City.State.Name : address.State_Addr) &&
    address.City.Name &&
    (address.PinCode ? address.PinCode.PinCode : address.PinCode)
  ) {
    userAddress = [
      address.AddressLine1,
      address.AddressLine2,
      address.AddressLine3,
      address.City.State ? address.City.State.Name : address.State_Addr,
      address.City.Name,
      address.PinCode.PinCode ? address.PinCode.PinCode : address.PinCode
    ]
  }

  const getAddress = userAddress.length ? userAddress.filter((add: any) => add).join(', ') : userAddress
  return getAddress
}

export const setApiKey = (key: any) => {
  setCookie(LocalKey.saveApi, JSON.stringify(key))
  window.localStorage.setItem(LocalKey.saveApi, JSON.stringify(key))
}

export const setUser = (user: any) => {
  setCookie(LocalKey.saveUser, JSON.stringify(user))
  setActiveRide({})
}

export const setActiveRide = (ride: any) => {
  setCookie(LocalKey.saveActiveRide, JSON.stringify(ride))
}

export const getStingToObject = (String: any) => {
  const splitSting = String.split(';')
  let obj = {}
  splitSting.forEach((ele: any) => {
    const splitEle = ele.split(':')
    obj = {
      ...obj,
      [splitEle[0]]: splitEle[1]
    }
  })
  return obj
}

export const getKeyValueFromString = (key: any, string: any) => {
  const subArray = string?.split(',')
  const match = subArray?.find((subKey: any) => {
    if (subKey.includes(key)) {
      return true
    }
  })
  return match?.split(':')[1]
}

export const setObjectToString = (obj: any) => {
  const UpTags: any = []
  Object.keys(obj).forEach(v => {
    if (VehicleTags.includes(v)) {
      UpTags.push(v + ':' + obj[v])
    }
  })
  return UpTags.join(',')
}
