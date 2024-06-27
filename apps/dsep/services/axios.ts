import { axiosInstance } from '@beckn-ui/common'
import store from '@store/index'

const axios = axiosInstance(store)

export default axios
