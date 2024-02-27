import axios from "axios";
import { config } from "../config/config.js";
import { spinnerService } from "@simply007org/react-spinners";
import { toast } from "react-toastify";
// import { getErrorMessage } from 'utils/functionUtils/commonFunctions';
import { AppRoutes, LocalKey, NoLoader, NoLoaderPath } from "./constant.js";
import { removeCookie, setCookie } from "./CookiesHandler.js";
import { setUser } from "./common.functions.js";
import { UserFields } from "./fieldsSet.js";
const apiBaseURL = config.API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

const getErrorMessage = function getErrorMessage(error) {
  console.log("logging test message");
  const errorTxt =
    error && error.response && error.response.data
      ? error.response.data.SWFHttpResponse.Error
      : "Oops! Something Went Wrong, Please Try Again Later.";
  return errorTxt;
};

// 'Accept-Encoding': 'gzip'
const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};

const errorHandler = (error) => {
  if (isHandlerEnabled(error.config)) {
    // console.log("requestHandler", error.response.status);
    if (error.response.status === 401) {
      removeCookie(LocalKey.saveApi);
      removeCookie(LocalKey.saveUser);
      window.location.href = AppRoutes.admin;
    }
    // Handle errors
    spinnerService.hide(LocalKey.spinnerKey);
    toast.error(getErrorMessage(error), {
      toastId: 1,
    });
  }
  return Promise.reject({ ...error });
};

const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
    spinnerService.hide(LocalKey.spinnerKey);
  }
  return response;
};

const requestHandler = (request) => {
  if (isHandlerEnabled(request)) {
    const URL = request.url;
    const isShowLoader = URL.includes(NoLoaderPath);
    console.log({ isShowLoader, URL });
    if (
      request.url &&
      !NoLoader.includes(request.url.split("?")[0]) &&
      !isShowLoader
    )
      spinnerService.show(LocalKey.spinnerKey);
    // Modify request here
    if (
      window.localStorage.getItem(LocalKey.saveApi) &&
      request.url !== "login"
    ) {
      request.headers["ApiKey"] = JSON.parse(
        window.localStorage.getItem(LocalKey.saveApi),
      ).ApiKey;
    }
  }
  return request;
};

axiosInstance.interceptors.request.use((request) => requestHandler(request));

axiosInstance.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error), //will activate after invistigation of sign-in page
);

// Get data request
export const getRequestData = (paths, fieldsList, location) => {
  let data = {
    data: {},
  };
  if (fieldsList) {
    let encodedHeader = btoa(fieldsList);
    data = {
      ...data.data,
      headers: {
        IncludedModelFields: encodedHeader,
      },
    };
  }
  if (location) {
    data = {
      ...data.data,
      headers: {
        ...(fieldsList && {
          IncludedModelFields: data.headers.IncludedModelFields,
        }),
        "X-Lat": location.latitude || 2.3,
        "X-Lng": location.longitude || 4.5,
      },
    };
  }
  return axiosInstance.get(paths, data);
};

// Post data request
export const postRequestData = (paths, data, fieldsList) => {
  let headers = {};
  if (fieldsList) {
    let encodedHeader = btoa(fieldsList);
    headers = {
      headers: {
        IncludedModelFields: encodedHeader,
      },
    };
  }
  return axiosInstance.post(paths, data, headers);
};

const makeAgent = async (id) => {
  let roleUrl = "user_roles/save";
  let roleData = {
    UserRole: {
      UserId: id,
      Role: {
        Id: "1",
      },
    },
  };
  return await postRequestData(roleUrl, roleData);
};

export const userSave = (path, data, fieldsList, IsStoreUpdate, roleType) => {
  return postRequestData(path, data, fieldsList).then((res) => {
    console.log("userUpdate", res.data.Users[0]);
    roleType === "agent" && makeAgent(res.data.Users[0].Id);
    IsStoreUpdate && getUser(res.data.Users[0].Id, roleType, "driver");
    return res;
  });
};

export const getUser = async (UserId, roleType) => {
  let userUrl = `users/show/${UserId}`;
  const getUser = await getRequestData(userUrl, UserFields);
  setUser(getUser.data.User);
  if (roleType != "driver") {
    getUser && window.location.reload();
  }
};
