import { VehicleTags } from "../shared/constant";
import { AppRoutes, LocalKey } from "./constant";
import { getCookie, setCookie } from "./CookiesHandler";
import { triggerEvent } from "../components/DriverApp/components/SwitchButton/Driver.Services";
export const setValue = (propertyPath, value, obj) => {
  let properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split(".");

  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    if (
      !obj.hasOwnProperty(properties[0]) ||
      typeof obj[properties[0]] !== "object"
    )
      obj[properties[0]] = {};
    return setValue(properties.slice(1), value, obj[properties[0]]);
  } else {
    // We set the value to the last property
    obj[properties[0]] = value;
    return true; // this is the end
  }
};

export const getValue = (propertyPath, obj) => {
  let properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split(".");
  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    if (
      !obj.hasOwnProperty(properties[0]) ||
      typeof obj[properties[0]] !== "object"
    )
      obj[properties[0]] = {};
    return setValue(properties.slice(1), obj[properties[0]]);
  } else {
    // We set the value to the last property
    return obj[properties[0]]; // this is the end
  }
};

export const isAuthenticated = (navigate) => {
  if (getCookie(LocalKey.saveApi)) {
    triggerEvent("mbth_login");
    //window.location.href = AppRoutes.driverDashboard;
    navigate(AppRoutes.driverDashboard);
  }
};

export const getAddress = function getAddress(address) {
  // console.log('getaddress', address.AddressLine1);
  let userAddress = [];
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
      address.PinCode.PinCode ? address.PinCode.PinCode : address.PinCode,
    ];
  }

  let getAddress = userAddress.length
    ? userAddress.filter((add) => add).join(", ")
    : userAddress;
  return getAddress;
};

export const setApiKey = (key) => {
  setCookie(LocalKey.saveApi, JSON.stringify(key), "/");
  window.localStorage.setItem(LocalKey.saveApi, JSON.stringify(key), "/");
};

export const setUser = (user) => {
  setCookie(LocalKey.saveUser, JSON.stringify(user), "/");
  setActiveRide({});
};

export const setActiveRide = (ride) => {
  setCookie(LocalKey.saveActiveRide, JSON.stringify(ride), "/");
};

export const getStingToObject = (String) => {
  let splitSting = String.split(";");
  let obj = {};
  splitSting.forEach((ele) => {
    let splitEle = ele.split(":");
    obj = {
      ...obj,
      [splitEle[0]]: splitEle[1],
    };
  });
  return obj;
};

export const getKeyValueFromString = (key, string) => {
  let subArray = string?.split(",");
  const match = subArray?.find((subKey) => {
    if (subKey.includes(key)) {
      return true;
    }
  });
  return match?.split(":")[1];
};

export const setObjectToString = (obj) => {
  let UpTags = [];
  Object.keys(obj).forEach((v) => {
    if (VehicleTags.includes(v)) {
      UpTags.push(v + ":" + obj[v]);
    }
  });
  return UpTags.join(",");
};
