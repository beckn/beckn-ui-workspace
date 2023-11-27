import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text } from '@chakra-ui/react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ButtonComp from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import AddShippingButton from '../components/detailsCard/AddShippingButton'
import { CartItemForRequest, DataPerBpp, ICartRootState, TransactionIdRootState } from '../lib/types/cart'
import { getCartItemsPerBpp } from '../utilities/cart-utils'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import { areShippingAndBillingDetailsSame, getPayloadForInitRequest } from '../utilities/checkout-utils'
import Loader from '../components/loader/Loader'
import AddBillingButton from '../components/detailsCard/AddBillingButton'
import { useRouter } from 'next/router'
import AddDisputeButton from '../components/detailsCard/AddDisputeButton'
import DisputeFillingDetails from '../components/detailsCard/DisputeFillingDetails'
import AddConsentButton from '../components/detailsCard/AddConsentButton'
import ConsentFillingDetails from '../components/detailsCard/ConsentFillingDetails'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  pinCode: string
}
export type DisputeFormData = {
  name: string
  claimValue: string
  address: string
}
export type ConsentFormData = {
  name: string
  address: string
}
const CheckoutPage = () => {
  const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
    name: 'Santosh Kumar',
    mobileNumber: '9612345678',
    email: 'santosh.kumar@gmail.com',
    address: '15 Jawahar nagar, New Delhi',
    pinCode: '475001'
  })
  const [formData, setFormData] = useState<ShippingFormData>({
    name: 'Ashwin Kumar',
    mobileNumber: '9612345678',
    email: 'ashwin.kumar@gmail.com',
    address: '151,saket nagar, New Delhi',
    pinCode: '475003'
  })
  const [disputeformData, setDisputeFormData] = useState<DisputeFormData>({
    name: '',
    claimValue: '',
    address: ''
  })
  const [consentformData, setConsentFormData] = useState<ConsentFormData>({
    name: '',
    address: ''
  })
  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const { data, loading, error, fetchData } = useRequest()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isDisputeButtonDisabled, setIsDisputeButtonDisabaled] = useState<boolean>(false)
  const [filledDetails, setFilledDetails] = useState({
    complainant: false,
    respondent: false,
    dispute: false,
    consent: false
  })
  const [selectedData, setSelectedData] = useState([])

  const initResponse = useSelector((state: any) => state.initResponse.initResponse)

  const router = useRouter()
  const initRequest = useRequest()
  const selectRequest = useRequest()
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)
  const [providerId, setProviderId] = useState(router.query?.providerId || '')
  const [productId, setProductId] = useState(router.query?.productId || '')
  const [loadingSelectData, setLoadingSelectData] = useState(true)

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem('userPhone')) {
        const copiedFormData = structuredClone(formData)
        const copiedBillingFormData = structuredClone(billingFormData)

        copiedFormData.mobileNumber = localStorage.getItem('userPhone') as string
        copiedBillingFormData.mobileNumber = localStorage.getItem('userPhone') as string

        setFormData(copiedFormData)
        setBillingFormData(copiedBillingFormData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('providerName', JSON.stringify(data?.scholarshipProviders[0].name))
      }
    }
  }, [data])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (localStorage.getItem('billingAddress')) {
        setBillingFormData(JSON.parse(localStorage.getItem('billingAddress') as string))
      }
      if (localStorage.getItem('disputeAddress')) {
        setDisputeFormData(JSON.parse(localStorage.getItem('disputeAddress') as string))
      }
      if (localStorage.getItem('consentAddress')) {
        setConsentFormData(JSON.parse(localStorage.getItem('consentAddress') as string))
      }
    }
  }, [])

  useEffect(() => {
    if (initRequest.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('initResult', JSON.stringify(initRequest.data))
      }

      dispatch(responseDataActions.addInitResponse(initRequest.data))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initRequest.data])

  useEffect(() => {
    if (selectRequest.data && typeof window !== 'undefined') {
      localStorage.setItem('selectResult', JSON.stringify(selectRequest.data))
    }
  }, [selectRequest.data])

  useEffect(() => {
    const shippingAddressComplete = Object.values(formData).every(value => value.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(formData))
    }
  }, [formData])

  useEffect(() => {
    const isBillingAddressComplete = Object.values(billingFormData).every(value => value.length > 0)
    if (isBillingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('billingAddress', JSON.stringify(billingFormData))
    }
    setIsBillingAddressSameAsShippingAddress(
      areShippingAndBillingDetailsSame(isBillingAddressComplete, formData, billingFormData)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingFormData])

  useEffect(() => {
    const isDisputeAddressComplete = Object.values(disputeformData).every(value => value.length > 0)
    if (isDisputeAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('disputeAdress', JSON.stringify(disputeformData))
    }
  }, [disputeformData])
  useEffect(() => {
    const isConsentAddressComplete = Object.values(consentformData).every(value => value.length > 0)
    if (isConsentAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('consentAdress', JSON.stringify(consentformData))
    }
  }, [consentformData])

  const formSubmitHandler = (type: string) => {
    if (!filledDetails.complainant && type === 'complainant') {
      setFilledDetails(prevDetails => ({ ...prevDetails, complainant: true }))
    } else if (!filledDetails.respondent && type === 'respondent') {
      setFilledDetails(prevDetails => ({ ...prevDetails, respondent: true }))
    } else if (!filledDetails.dispute && type === 'dispute') {
      setFilledDetails(prevDetails => ({ ...prevDetails, dispute: true }))
    } else if (!filledDetails.consent && type === 'consent') {
      setFilledDetails(prevDetails => ({ ...prevDetails, consent: true }))
      console.log(filledDetails)
    }

    if (formData) {
      const payLoadForInitRequest = getPayloadForInitRequest(data, formData, billingFormData)
      initRequest.fetchData(`${apiUrl}/init`, 'POST', payLoadForInitRequest)
    }
  }

  const fetchSelectData = () => {
    const selectPayload = {
      scholarshipProviderId: providerId,
      scholarshipId: productId,
      context: {
        transactionId: transactionId.transactionId,
        bppId: 'beckn-sandbox-bpp.becknprotocol.io',
        bppUri: 'https://sandbox-bpp-network.becknprotocol.io'
      }
    }

    selectRequest
      .fetchData(`${apiUrl}/select`, 'POST', selectPayload)
      .then(() => {
        setLoadingSelectData(false)
      })
      .catch(error => {
        console.error('Error fetching select data:', error)
        setLoadingSelectData(false)
      })
  }

  useEffect(() => {
    fetchSelectData()
  }, [])

  if (initRequest.loading || loadingSelectData) {
    return (
      <Loader
        stylesForLoadingText={{
          fontWeight: '600',
          fontSize: '16px'
        }}
        subLoadingText={t.caseFormLoaderText}
        loadingText={t.catalogLoader}
      />
    )
  }

  const isInitResultPresent = () => {
    if (typeof window !== 'undefined') {
      if (
        localStorage.getItem('initResult') &&
        filledDetails.complainant &&
        filledDetails.respondent &&
        filledDetails.dispute &&
        filledDetails.consent
      ) {
        return true
      }
    }

    return false
  }

  const handleFormValidity = (newFormValidity: boolean) => {
    setIsDisabled(!newFormValidity)
  }
  const handleDisputeFormValidity = (newFormValidity: boolean) => {
    setIsDisputeButtonDisabaled(!newFormValidity)
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {!isInitResultPresent() && !filledDetails.complainant ? (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.complaintDetails}</Text>
          </Flex>
          <DetailsCard>
            <AddBillingButton
              checkFormValidity={handleFormValidity}
              imgFlag={!isInitResultPresent() && !filledDetails.complainant}
              billingFormData={billingFormData}
              setBillingFormData={setBillingFormData}
              addBillingdetailsBtnText={t.addCompalintDetailsBtn}
              billingFormSubmitHandler={() => formSubmitHandler('complainant')}
            />
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.complaintDetails}</Text>
            <AddBillingButton
              checkFormValidity={handleFormValidity}
              imgFlag={isInitResultPresent() && !filledDetails.complainant}
              billingFormData={billingFormData}
              setBillingFormData={setBillingFormData}
              addBillingdetailsBtnText={t.changeText}
              billingFormSubmitHandler={() => formSubmitHandler('complainant')}
            />
          </Flex>
          <ShippingOrBillingDetails
            accordionHeader={t.complaintDetails}
            name={billingFormData.name}
            location={billingFormData.address}
            number={billingFormData.mobileNumber}
          />
        </Box>
      )}
      {!isInitResultPresent() && !filledDetails.respondent ? (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.respondentDetails}</Text>
          </Flex>
          <DetailsCard>
            <AddShippingButton
              imgFlag={!isInitResultPresent() && !filledDetails.respondent}
              formData={formData}
              setFormData={setFormData}
              addShippingdetailsBtnText={t.addRespondentDetaislBtn}
              formSubmitHandler={() => formSubmitHandler('respondent')}
            />
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.respondentDetails}</Text>
            <AddShippingButton
              imgFlag={isInitResultPresent() && !filledDetails.respondent}
              formData={formData}
              setFormData={setFormData}
              addShippingdetailsBtnText={t.changeText}
              formSubmitHandler={() => formSubmitHandler('respondent')}
            />
          </Flex>

          <ShippingOrBillingDetails
            accordionHeader={t.respondentDetails}
            name={formData.name}
            location={formData.address}
            number={formData.mobileNumber}
          />
        </Box>
      )}
      {!isInitResultPresent() && !filledDetails.dispute ? (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.disputeDetails}</Text>
          </Flex>
          <DetailsCard>
            <AddDisputeButton
              checkFormValidity={handleDisputeFormValidity}
              isDisabled={isDisabled}
              imgFlag={!isInitResultPresent() && !filledDetails.dispute}
              formData={disputeformData}
              setFormData={setDisputeFormData}
              addShippingdetailsBtnText={t.addDisputeDetailsBtn}
              formSubmitHandler={() => formSubmitHandler('dispute')}
            />
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.disputeDetails}</Text>
            <AddDisputeButton
              checkFormValidity={handleDisputeFormValidity}
              isDisabled={isDisabled}
              imgFlag={isInitResultPresent() && !filledDetails.dispute}
              formData={disputeformData}
              setFormData={setDisputeFormData}
              addShippingdetailsBtnText={t.changeText}
              formSubmitHandler={() => formSubmitHandler('dispute')}
            />
          </Flex>
          <DisputeFillingDetails accordionHeader={t.disputeDetails} />
        </Box>
      )}

      {!isInitResultPresent() && !filledDetails.consent ? (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.consent}</Text>
          </Flex>
          <DetailsCard>
            <AddConsentButton
              isDisabled={isDisputeButtonDisabled}
              imgFlag={!isInitResultPresent() && !filledDetails.consent}
              formData={consentformData}
              setFormData={setConsentFormData}
              addShippingdetailsBtnText={t.fillConsentForm}
              formSubmitHandler={() => formSubmitHandler('consent')}
            />
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.consent}</Text>
            <AddConsentButton
              isDisabled={isDisputeButtonDisabled}
              imgFlag={isInitResultPresent() && !filledDetails.consent}
              formData={consentformData}
              setFormData={setConsentFormData}
              addShippingdetailsBtnText={t.changeText}
              formSubmitHandler={() => formSubmitHandler('consent')}
            />
          </Flex>
          <ConsentFillingDetails accordionHeader={t.fillConsentForm} />
        </Box>
      )}
      {!isInitResultPresent() ? (
        <Box
          position={'absolute'}
          left={'5%'}
          width={'90%'}
          bottom={'0'}
        >
          <ButtonComp
            buttonText={'Confirm'}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
            handleOnClick={() => router.push('/orderConfirmation')}
            isDisabled={true}
          />
        </Box>
      ) : (
        <ButtonComp
          buttonText={'Confirm'}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          handleOnClick={() => router.push('/orderConfirmation')}
          isDisabled={false}
        />
      )}
    </Box>
  )
}

export default CheckoutPage
