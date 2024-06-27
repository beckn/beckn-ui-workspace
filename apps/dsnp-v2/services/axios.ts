import defaultAxios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import store from '@store/index'
import { feedbackActions } from '@store/ui-feedback-slice'

const axios = defaultAxios.create()

// Add a response interceptor
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Check if the error response exists and dispatch an action to the Redux store
    console.log(error)
    // Optionally, you can also log the error or perform other actions
    store.dispatch(
      feedbackActions.setToastData({
        toastData: {
          display: true,
          message: 'Error!' || 'Something went wrong',
          type: 'error',
          description:
            error?.response?.data?.error?.details?.errors[0].message.replace(
              /This attribute/g,
              error?.response?.data?.error?.details?.errors[0].path[0]
            ) || error.message
        }
      })
    )

    // Reject the promise to allow further error handling in the calling code
    return Promise.reject(error)
  }
)

export default axios
