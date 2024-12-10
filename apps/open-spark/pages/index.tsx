import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import _ from 'lodash'
import { AuthRootState } from '@store/auth-slice'

const Homepage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const {
    currentAddress,
    coordinates,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress,
    country
  } = useGeolocation(apiKeyForGoogle as string)

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
      />
    </>
  )
}

export default Homepage
