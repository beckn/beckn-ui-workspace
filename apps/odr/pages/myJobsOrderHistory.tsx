'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Flex, Text, Image, Card, CardBody } from '@chakra-ui/react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ItemDetails from '../components/detailsCard/ItemDetails'
import ButtonComp from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import { getOrderPlacementTimeline } from '../utilities/confirm-utils'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import { areShippingAndBillingDetailsSame } from '../utilities/checkout-utils'
import Loader from '../components/loader/Loader'

import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import axios from 'axios'
import { CaseDetails } from '../lib/types/caseDetails'

import { fromBinary } from '../utilities/common-utils'

import ShowCaseAttachments from '../components/orderHistory/orderHostory-utils/ShowCaseAttachments'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  pinCode: string
}

const CaseDetailsPage = () => {
  const [formData, setFormData] = useState<ShippingFormData>({
    name: 'Santosh Kumar',
    mobileNumber: '9876543210',
    email: 'santosh.k@gmail.com',
    address: '151-E, Janpath Road, New Delhi',
    pinCode: '201016'
  })
  const [respondenDetails, setRespondentDetails] = useState({
    name: 'Maria',
    address: '2111, 30th Main, HSR Layout, Sector 2, Bangalore- 560102',
    mobileNumber: '+91 9976543210'
  })
  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null)

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    const email = Cookies.get('userEmail') as string

    axios
      .get(`${strapiUrl}/profiles?populate[0]=documents.attachment`, axiosConfig)
      .then(res => {
        const profileResponse = res.data
        const documents = profileResponse.data.attributes.documents.data

        const profileData = profileResponse.data.attributes

        const { name, phone, address, zip_code } = profileData
        setFormData({
          address: address ? address : '',
          email,
          mobileNumber: phone,
          pinCode: zip_code ? zip_code : '',
          name
        })
      })
      .catch(e => console.error(e))
  }, [])

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
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (localStorage.getItem('billingAddress')) {
        setBillingFormData(JSON.parse(localStorage.getItem('billingAddress') as string))
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
  }, [initRequest.data])

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
  }, [billingFormData])

  useEffect(() => {
    const { courseOrder } = router.query
    if (courseOrder) {
      setCaseDetails(JSON.parse(fromBinary(window.atob(courseOrder as string))))
    }
  }, [router.query])

  if (initRequest.loading) {
    return <Loader loadingText={t['initializingOrderLoader']} />
  }

  const loggedOn = getOrderPlacementTimeline(caseDetails?.attributes.updatedAt ?? 'default')

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box>
        <Box pb={'10px'}></Box>
        {caseDetails?.attributes.delivery_status === 'Fulfilled' && (
          <Card
            className="border_radius_all"
            mb={'20px'}
            boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
            borderColor="#5EC401"
            borderWidth="1.5px"
          >
            <CardBody padding={'15px 20px'}>
              <Box>
                <Flex
                  gap={4}
                  align={'start'}
                >
                  <Image
                    src="/images/TickMark.svg"
                    paddingTop={1}
                  />
                  <Flex direction={'column'}>
                    <Text
                      fontWeight={700}
                      fontSize={'17px'}
                    >
                      All requests have been fulfilled!
                    </Text>
                    <Text>
                      How did we do? <span style={{ color: '#A71B4A' }}>Rate Us</span>
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </CardBody>
          </Card>
        )}
        <DetailsCard>
          <>
            <Text
              fontSize={'17px'}
              fontWeight={700}
              paddingBottom={2}
            >
              {t.caseSummary}
            </Text>
            <ItemDetails
              title={caseDetails?.attributes?.items[0]?.descriptor?.name ?? 'Default'}
              provider={caseDetails?.attributes?.descriptor?.name ?? 'Default'}
              caseId={caseDetails?.id ?? 0}
              loggedOn={loggedOn}
            />
          </>
        </DetailsCard>
      </Box>
      <Box>
        <Flex
          pb={'10px'}
          mt={'20px'}
          justifyContent={'space-between'}
        ></Flex>

        <ShippingOrBillingDetails
          accordionHeader={t.complainantDetails}
          name={formData.name}
          location={formData.address}
          number={formData.mobileNumber}
        />
        <Flex
          pb={'10px'}
          mt={'20px'}
          justifyContent={'space-between'}
        ></Flex>

        <ShippingOrBillingDetails
          accordionHeader={t.respondentDetails}
          name={respondenDetails.name}
          location={respondenDetails.address}
          number={respondenDetails.mobileNumber}
        />
      </Box>
      <ShowCaseAttachments
        header="Dispute Details"
        details="Dispute details added"
      />
      <ShowCaseAttachments
        header="Consent"
        details="Consent Form Filled"
      />

      <ButtonComp
        buttonText={t.continue}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={() => router.push('/review')}
        isDisabled={false}
      />
    </Box>
  )
}
export default CaseDetailsPage
