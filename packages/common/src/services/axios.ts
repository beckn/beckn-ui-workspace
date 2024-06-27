import defaultAxios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { Store } from 'redux'
import { feedbackActions } from '../store/ui-feedback-slice'

const createAxiosInstance = (store: Store): AxiosInstance => {
  const axios = defaultAxios.create()

  // Add a response interceptor
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      // Check if the error response exists and dispatch an action to the Redux store
      store.dispatch(
        feedbackActions.setToastData({
          toastData: {
            display: true,
            message: 'Error!' || 'Something went wrong',
            type: 'error',
            description: error.message
          }
        })
      )

      // Reject the promise to allow further error handling in the calling code
      return Promise.reject(error)
    }
  )

  return axios
}

export default createAxiosInstance
