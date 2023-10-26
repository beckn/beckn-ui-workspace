import { useState } from 'react'
import axios from 'axios'
import { ResponseModel } from '../lib/types/responseModel'

const useRequest = () => {
  const [data, setData] = useState<(ResponseModel & ResponseModel[]) | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchData = async (url: string, method = 'POST', payLoad: any = null) => {
    try {
      setLoading(true)
      const response = await axios.request({
        url,
        method,
        data: payLoad
      })
      setData(response.data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}

export default useRequest
