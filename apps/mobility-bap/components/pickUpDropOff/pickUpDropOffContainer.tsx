import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PickUpDropOff from './pickUpDropOff'
import { UserGeoLocationRootState } from '@lib/types/user'
import { getSearchRidePayload, parsedSearchDetails } from '@utils/cabDetails'
import axios from '@services/axios'
import { setCabResultFound, setCabServiceProviders, setCancelTokenSource, setTotalCabs } from '@store/cabService-slice'
import { feedbackActions } from '@beckn-ui/common'
import { useRouter } from 'next/router'
import { CabServiceDetailsRootState } from '@lib/types/cabService'
import AlertModal from '@components/alertModal/alertModal'
import { testIds } from '@shared/dataTestIds'
import { Box } from '@chakra-ui/react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface PickUpDropOffContainerProps {
  handleOnClick: (fallback?: boolean) => void
  handleOnSearch: () => void
}

const PickUpDropOffContainer = (props: PickUpDropOffContainerProps) => {
  const { handleOnClick, handleOnSearch } = props

  const [violationPolicyData, setViolationPolicyData] = useState<{ policyId: string; name: string }>({
    policyId: '',
    name: ''
  })
  const [openAlert, setOpenAlert] = useState<boolean>(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)
  const { rideSearchInProgress } = useSelector((state: CabServiceDetailsRootState) => state.cabService)

  const checkViolation = (policyCheckResults: any) => {
    return policyCheckResults.find((policy: any) => {
      return policy.violation && policy.violatedPolicies && policy.violatedPolicies.length > 0
    })
  }

  const voilationCheck = () => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_POLICY_VIOLATION}/bap/policy/checkViolation`, {
          locations: [`${dropoff.geoLocation.latitude},${dropoff.geoLocation.longitude}`],
          bap_id: 'mit-ps-bap.becknprotocol.io'
        })
        .then(res => {
          const policyCheckResults = res.data.policyCheckResult
          const violatedPolicy = checkViolation(policyCheckResults)

          if (violatedPolicy && violatedPolicy?.violation) {
            const data = {
              name: violatedPolicy.violatedPolicies[0].name,
              policyId: violatedPolicy.violatedPolicies[0].id
            }
            setViolationPolicyData(data)
            setOpenAlert(true)
          } else {
            handleSearchRide()
          }
        })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearchRide = useCallback(() => {
    console.log(pickup, dropoff)
    const cancelTokenSource = axios.createCancelToken()
    dispatch(setCancelTokenSource(cancelTokenSource))

    const payload = getSearchRidePayload(pickup, dropoff)

    dispatch(setCabResultFound(true))
    handleOnSearch()

    axios
      .post(`${apiUrl}/search`, payload, { cancelToken: cancelTokenSource.token })
      .then(async res => {
        if (res.data?.data) {
          const { providerDetails, totalCabs } = await parsedSearchDetails(res.data.data)
          dispatch(setCabServiceProviders(providerDetails))
          dispatch(setTotalCabs(totalCabs))
          dispatch(setCabResultFound(false))
          handleOnClick()
        } else {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Info',
                display: true,
                type: 'success',
                description: 'No ride available, please try again!'
              }
            })
          )
          handleOnClick(true)
        }
      })
      .catch(e => {
        if (axios.isCancel(e)) {
          console.log('Request canceled:', e.message)
        } else {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Error',
                display: true,
                type: 'error',
                description: 'Something went wrong, please try again'
              }
            })
          )
          handleOnClick(true)
        }
      })
      .finally(() => {
        dispatch(setCabResultFound(false))
      })
  }, [pickup, dropoff])

  const handleOpenViolatedPolicy = () => {
    router.push({
      pathname: '/quarantineZone',
      query: {
        policyId: violationPolicyData.policyId
      }
    })
  }

  const handleAlertSubmit = () => {
    handleSearchRide()
  }

  return (
    <Box data-test={testIds.mobility_pickup_dropoff}>
      <PickUpDropOff
        pickup={pickup!}
        dropoff={dropoff!}
        handleClickOnSearchRides={voilationCheck}
      />
      {openAlert && (
        <AlertModal
          isOpen={true}
          name={violationPolicyData.name}
          handleOnClose={() => {
            setOpenAlert(false)
            setViolationPolicyData({ policyId: '', name: '' })
          }}
          handleOpenPolicy={handleOpenViolatedPolicy}
          handleAlertSubmit={handleAlertSubmit}
        />
      )}
    </Box>
  )
}

export default PickUpDropOffContainer
