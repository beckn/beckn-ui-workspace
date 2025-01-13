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
      // Check if the error response exists and dispatch an action to the Redux store
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

      // Reject the promise to allow further error handling in the calling code
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
