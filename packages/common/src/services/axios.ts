import defaultAxios, { AxiosError, AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios'
import { Store } from 'redux'
import { feedbackActions } from '../store/ui-feedback-slice'

interface CustomAxiosInstance extends AxiosInstance {
  createCancelToken: () => CancelTokenSource
  isCancel: (value: any) => boolean
}

const createAxiosInstance = (store: Store): CustomAxiosInstance => {
  const axios = defaultAxios.create() as CustomAxiosInstance

  // Add a response interceptor
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      // Handle network errors
      if (!error.response) {
        if (error.message.includes('ERR_NETWORK_CHANGED')) {
          store.dispatch(
            feedbackActions.setToastData({
              toastData: {
                display: true,
                message: 'Network Error',
                type: 'error',
                description: 'Network connection changed. Please check your connection and try again.'
              }
            })
          )
        } else if (error.message.includes('Network Error')) {
          store.dispatch(
            feedbackActions.setToastData({
              toastData: {
                display: true,
                message: 'Network Error',
                type: 'error',
                description: 'Please check your internet connection and try again.'
              }
            })
          )
        }
        return Promise.reject(error)
      }

      // Handle other errors
      store.dispatch(
        feedbackActions.setToastData({
          toastData: {
            display: true,
            message: 'Error!',
            type: 'error',
            description:
              error?.response?.data?.error?.details?.errors?.[0].message.replace(
                /This attribute/g,
                error?.response?.data?.error?.details?.errors?.[0].path[0]
              ) ||
              error?.response?.data?.error?.message ||
              error.message
          }
        })
      )

      return Promise.reject(error)
    }
  )

  // Add method to create a cancel token
  axios.createCancelToken = () => {
    return defaultAxios.CancelToken.source()
  }

  axios.isCancel = defaultAxios.isCancel

  return axios
}

export default createAxiosInstance
