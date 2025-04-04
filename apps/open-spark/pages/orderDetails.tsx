import React, { useEffect, useState } from 'react'
import axios from '@services/axios'
import Router, { useRouter } from 'next/router'
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
  Image,
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useTheme,
  useToast
} from '@chakra-ui/react'
import { Accordion, BottomModal, Typography } from '@beckn-ui/molecules'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
// import ViewMoreOrderModal from '@components/orderDetailComponents/ViewMoreOrder'
// import { statusActions } from '@store/status-slice'
import { DetailCard, OrderStatusProgress, OrderStatusProgressProps } from '@beckn-ui/becknified-components'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import { getPaymentBreakDown, isEmpty } from '@beckn-ui/common/src/utils'
import { useLanguage } from '@hooks/useLanguage'
import { getPayloadForOrderStatus, formatTimestamp } from '@beckn-ui/common/src/utils'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
// import BottomModalScan from '@components/BottomModal/BottomModalScan'
// import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import locationIcon from '../public/images/locationIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
// import ShippingBlock from '@components/orderDetailComponents/Shipping'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
// import { feedbackActions } from '@store/ui-feedback-slice'
import {
  ConfirmResponseModel,
  DataState,
  DiscoveryRootState,
  Item,
  ProcessState,
  QuantityDetails,
  StatusResponseModel,
  SupportModel,
  UIState
} from '@beckn-ui/common/lib/types'
import { statusActions } from '@beckn-ui/common/src/store/status-slice'
import { OrdersRootState } from '@beckn-ui/common/src/store/order-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { DOMAIN, DOMAIN_PATH, ROLE, ROUTE_TYPE } from '@lib/config'
import { testIds } from '@shared/dataTestIds'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { AuthRootState } from '@store/auth-slice'
import { generateAuthHeader, generateKeyPairFromString } from '@services/cryptoUtilService'
import {
  getVerificationMethods,
  useAddDocumentMutation,
  useGetVerificationMethodsMutation
} from '@services/walletService'
import { extractAuthAndHeader, generateRandomCode, getCountryCode, toBase64, toSnakeCase } from '@utils/general'
import { RootState } from '@store/index'
import { StatusKey, statusMap } from '@lib/types/order'
import ShippingBlock from '@components/orderDetailComponents/Shipping'
import QRCodeGenerator from '@components/QRCode/QRGenerator'

const DELIVERED = 'ORDER_DELIVERED'
const CANCELLED = 'USER CANCELLED'

const OrderDetails = () => {
  const [uiState, setUiState] = useState<UIState>({
    isProceedDisabled: true,
    isLoading: true,
    isLoadingForTrackAndSupport: false,
    isMenuModalOpen: false,
    isCancelMenuModalOpen: false,
    isLoadingForCancel: false
  })

  const theme = useTheme()

  const [data, setData] = useState<DataState>({
    confirmData: null,
    statusData: [],
    trackUrl: null,
    supportData: null
  })

  const [processState, setProcessState] = useState<ProcessState>({
    apiCalled: false,
    allOrderDelivered: false,
    radioValue: '',
    orderCancelled: false
  })
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [orderStatusMap, setOrderStatusMap] = useState<any[]>([])
  const { isDesktop } = useResponsive()
  const { transactionId } = useSelector((state: DiscoveryRootState) => state.discovery)
  const orderMetaData = useSelector((state: OrdersRootState) => state.orders.selectedOrderDetails)
  const dispatch = useDispatch()
  const [currentStatusLabel, setCurrentStatusLabel] = useState('')
  const [isError, setIsError] = useState(false)

  const { user } = useSelector((state: AuthRootState) => state.auth)
  const type = useSelector((state: RootState) => state.navigation.type)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { isLoading: verificationMethodsLoading }] = useGetVerificationMethodsMutation()

  useEffect(() => {
    const storedOrderStatusMap = JSON.parse(localStorage.getItem('orderStatusMap') || '[]')
    setOrderStatusMap(storedOrderStatusMap)
  }, [])

  useEffect(() => {
    if (orderStatusMap.length > 0) {
      localStorage.setItem('orderStatusMap', JSON.stringify(orderStatusMap))
      setCurrentStatusLabel(orderStatusMap[orderStatusMap.length - 1].label)
    }
  }, [orderStatusMap])

  useEffect(() => {
    if (data.statusData.length > 0) {
      const newData = data.statusData
        .map((status: StatusResponseModel) => {
          const { tags } = status?.message?.order
          const statusKey: string = tags?.[tags?.length - 1].list?.[0].value!
          return {
            label: statusMap[status?.message?.order?.fulfillments[0]?.state?.descriptor?.code as StatusKey],
            statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at || status?.context?.timestamp
          }
        })
        .filter(status => status.label)

      const labelSet = new Set(orderStatusMap.map(status => status.label))
      setOrderStatusMap(prevState => [...prevState, ...newData.filter(status => !labelSet.has(status.label))])
    }
  }, [data.statusData])

  const orderCancelReason = [
    { id: 1, reason: 'Merchant is taking too long' },
    { id: 2, reason: 'Ordered by mistake' },
    { id: 3, reason: "I've changed my mind" },
    { id: 4, reason: 'Other' }
  ]

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setData(prevState => ({
        ...prevState,
        confirmData: parsedConfirmData
      }))
    }
  }, [])

  // Define functions to handle menu modal opening and closing
  const handleMenuModalClose = () => {
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  const handleCancelMenuModalClose = () => {
    setUiState(prevState => ({
      ...prevState,
      isCancelMenuModalOpen: false
    }))
  }

  const handleCancelMenuModalOpen = () => {
    setUiState(prevState => ({
      ...prevState,
      isCancelMenuModalOpen: true,
      isMenuModalOpen: false
    }))
  }

  const handleEmailCustomer = (email: string) => {
    const subject = 'Regarding Your Order'
    const body = 'Dear Customer,\n\n'

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.open(mailtoLink, '_blank')
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }
  const handleCallCustomer = (phoneNumber: string) => {
    // Use tel: protocol to initiate the phone call
    const telLink = `tel:${phoneNumber}`

    // Open the phone app to initiate the call
    window.open(telLink, '_blank')
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  // Define menu items for the main menu
  const menuItems = (trackingUrl: string) => [
    {
      image: '/images/trackOrder.svg',
      text: 'Track Order',
      onClick: () => {
        if (trackingUrl) window.open(trackingUrl, '_blank')
        else
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Error', display: true, type: 'error', description: t.unabletoTrack }
            })
          )
      }
    },
    {
      image: '/images/updateOrder.svg',
      text: 'Update Order',
      onClick: () => {
        Router.push('/updateShippingDetails')
      }
    },
    {
      image: '/images/cancelOrder.svg',
      text: (
        <Text
          as="span"
          color="#E93324"
          fontWeight="400"
          fontSize="15px"
        >
          Cancel Order
        </Text>
      ),
      onClick: handleCancelMenuModalOpen
    }
  ]

  // Define menu items for the call menu
  const callMenuItem = (supportInfo: SupportModel) => [
    {
      image: '/images/callCustomer.svg',
      text: 'Call Customer Service',
      onClick: () => handleCallCustomer(supportInfo.phone)
    },
    {
      image: '/images/emailCustomer.svg',
      text: 'Email Customer Service',
      onClick: () => handleEmailCustomer(supportInfo.email)
    }
  ]

  const extractItemsWithProvider = (orders: ConfirmResponseModel[] | string): string => {
    if (!orders || (Array.isArray(orders) && orders.length === 0)) return ''

    if (typeof orders === 'string') {
      return orders.length > 50 ? orders.slice(0, 47) + '...' : orders
    }

    return orders
      .map(order => {
        const providerName = order.message.provider.name
        const itemNames = order.message.items.map((item: any) => item.name).join(', ')
        let result = `${itemNames} by ${providerName}`

        return result.length > 50 ? result.slice(0, 47) + '...' : result
      })
      .join('; ')
  }

  const attestDocument = async (did: string, transactionType: 'PHYSICAL_ASSETS' | 'TRANSACTION') => {
    try {
      const requestOptions = {
        method: 'POST',
        withCredentials: true
      }

      const res = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/attest`,
        {
          wallet_doc_type: transactionType,
          document_id: did,
          deg_wallet_id: user?.deg_wallet?.deg_wallet_id!
        },
        requestOptions
      )
    } catch (err) {
      console.error('Error attesting document:', err)
    }
  }

  const handleOnAddToPhysicalAsset = async (statusRes: any) => {
    if (user?.deg_wallet && user?.deg_wallet.energy_assets_consent) {
      const orderConfirmationData = JSON.parse(statusRes)
      if (orderConfirmationData) {
        try {
          const subjectKey = user?.deg_wallet?.deg_wallet_id.replace('/subjects/', '')
          const { publicKey, privateKey } = await generateKeyPairFromString(subjectKey!)
          console.log(orderConfirmationData)
          const totalItemsStr = extractItemsWithProvider(orderConfirmationData[0].message.order.items[0].name)

          const data: any = {
            type: totalItemsStr,
            confirmDetails: orderConfirmationData
          }

          const docDetails = JSON.stringify(data)
          const createdAt = Math.floor(new Date(statusOrderData?.order?.created_at).getTime() / 1000)
          const generatedOrderId = orderConfirmationData[0].message.order.id
          const verificationMethodsRes = await getVerificationMethods(user?.deg_wallet?.deg_wallet_id!).unwrap()
          const { did, challenge } = verificationMethodsRes[0]

          const authHeaderRes = await generateAuthHeader({
            subjectId: user?.deg_wallet?.deg_wallet_id!,
            verification_did: did,
            privateKey,
            publicKey,
            payload: {
              name: `assets/physical/type/${toSnakeCase(data?.type!)}/source/spark/${createdAt}/${generatedOrderId}`,
              stream: toBase64(docDetails)
            }
          })
          const { authorization, payload } = extractAuthAndHeader(authHeaderRes)
          if (authorization && payload) {
            const addDocPayload = {
              subjectId: user?.deg_wallet?.deg_wallet_id!,
              payload,
              authorization
            }

            const res: any = await addDocument(addDocPayload).unwrap()
            console.log(res)
            await attestDocument(res?.[0]?.did, 'PHYSICAL_ASSETS')

            dispatch(
              feedbackActions.setToastData({
                toastData: { message: 'Success', display: true, type: 'success', description: 'Added Successfully!' }
              })
            )
          } else {
            dispatch(
              feedbackActions.setToastData({
                toastData: { message: 'Error', display: true, type: 'error', description: 'Something went wrong!' }
              })
            )
          }
        } catch (error) {
          console.error('An error occurred:', error)
        }
      }
    } else {
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: user?.deg_wallet?.energy_assets_consent ? 'Warning' : 'Wallet not connected!',
            display: true,
            type: 'warning',
            description: 'Please connect your wallet before proceeding.'
          }
        })
      )
    }
  }

  // Fetch data on component
  useEffect(() => {
    const fetchData = () => {
      if (localStorage && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { bppId, bppUri, orderId } = selectedOrderData
        const statusPayload = {
          data: [
            {
              context: {
                transaction_id: uuidv4(),
                bpp_id: bppId,
                bpp_uri: bppUri,
                domain: type === 'MY_STORE' ? DOMAIN_PATH.MY_STORE : DOMAIN_PATH.RENT_AND_HIRE,
                location: getCountryCode()
              },
              message: {
                order_id: orderId,
                orderId: orderId
              }
            }
          ]
        }
        setUiState(prevState => ({
          ...prevState,
          isLoading: true
        }))

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            if (JSON.stringify(res.data) === '{}') {
              return setIsError(true)
            }
            const resData = res.data.data
            setData(prevState => ({
              ...prevState,
              statusData: resData
            }))
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setUiState(prevState => ({
              ...prevState,
              isLoading: false
            }))

            setProcessState(prevState => ({
              ...prevState,
              apiCalled: true
            }))
          })
      }
      if (data.confirmData && data.confirmData.length > 0) {
        const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
        const statusPayload = getPayloadForOrderStatus(parsedConfirmData, {
          location: getCountryCode()
        })
        setUiState(prevState => ({
          ...prevState,
          isLoading: true
        }))

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            if (JSON.stringify(res.data) === '{}') {
              return setIsError(true)
            }
            const resData = res.data.data
            setData(prevState => ({
              ...prevState,
              statusData: resData
            }))

            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setUiState(prevState => ({
              ...prevState,
              isLoading: false
            }))
            setProcessState(prevState => ({
              ...prevState,
              apiCalled: true
            }))
          })
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 60000)

    return () => clearInterval(intervalId)
  }, [apiUrl, data.confirmData])

  // Check if the order is delivered  come her
  const isDelivered = data.statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === DELIVERED
  const isCancelled = data.statusData?.[0]?.message?.order?.status === CANCELLED

  console.log('Dank cancel', isCancelled)

  useEffect(() => {
    if (isDelivered) {
      setProcessState(prevState => ({
        ...prevState,
        allOrderDelivered: true
      }))
    }
  }, [isDelivered])

  useEffect(() => {
    if (isCancelled) {
      setProcessState(prevState => ({
        ...prevState,
        orderCancelled: true
      }))
    }
  }, [isCancelled])

  // const handleOrderDotsClick = async () => {
  //   setUiState(prevState => ({
  //     ...prevState,
  //     isLoadingForTrackAndSupport: true
  //   }))

  //   try {
  //     setUiState(prevState => ({
  //       ...prevState,
  //       isMenuModalOpen: true
  //     }))
  //     if (data.confirmData && data.confirmData.length > 0) {
  //       const { domain, bpp_id, bpp_uri, transaction_id } = data.confirmData[0].context
  //       const orderId = data.confirmData[0].message.orderId
  //       const trackPayload = {
  //         data: [
  //           {
  //             context: {
  //               domain: domain,
  //               bpp_id: bpp_id,
  //               bpp_uri: bpp_uri,
  //               transaction_id: uuidv4()
  //             },
  //             orderId
  //             // callbackUrl: 'https://dhp-network-bap.becknprotocol.io/track/callback'
  //           }
  //         ]
  //       }

  //       const supportPayload = {
  //         data: [
  //           {
  //             context: {
  //               domain,
  //               bpp_id,
  //               bpp_uri,
  //               transaction_id: uuidv4()
  //             },
  //             message: {
  //               order_id: orderId,
  //               support: {
  //                 callback_phone: '+91-8858150053',
  //                 ref_id: '894789-43954',
  //                 phone: '+91 9988776543',
  //                 email: 'supportperson@gmail.com'
  //               }
  //             }
  //           }
  //         ]
  //       }

  //       const [trackResponse, supportResponse] = await Promise.all([
  //         axios.post(`${apiUrl}/track`, trackPayload),
  //         axios.post(`${apiUrl}/support`, supportPayload)
  //       ])

  //       if (!isEmpty(trackResponse.data) && !isEmpty(supportResponse.data)) {
  //         setData(prevState => ({
  //           ...prevState,
  //           trackUrl: trackResponse.data.data[0].message && trackResponse.data.data[0].message.tracking.url,
  //           supportData: {
  //             email: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.email,
  //             phone: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.phone
  //           }
  //         }))

  //         setUiState(prevState => ({
  //           ...prevState,
  //           isLoadingForTrackAndSupport: false
  //         }))
  //       }
  //     } else if (localStorage.getItem('selectedOrder') && localStorage.getItem('statusResponse')) {
  //       const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
  //       const { bppId, bppUri, orderId } = selectedOrderData
  //       const statusResponseData = JSON.parse(localStorage.getItem('statusResponse') as string)
  //       const { domain, transaction_id } = statusResponseData[0].context
  //       const trackPayload = {
  //         data: [
  //           {
  //             context: {
  //               domain: domain,
  //               bpp_id: bppId,
  //               bpp_uri: bppUri,
  //               transaction_id: uuidv4()
  //             },
  //             orderId,
  //             callbackUrl: 'https://dhp-network-bap.becknprotocol.io/track/callback'
  //           }
  //         ]
  //       }

  //       const supportPayload = {
  //         data: [
  //           {
  //             context: {
  //               domain: domain,
  //               bpp_id: bppId,
  //               bpp_uri: bppUri,
  //               transaction_id: uuidv4()
  //             },
  //             message: {
  //               order_id: orderId,
  //               support: {
  //                 callback_phone: '+91-8858150053',
  //                 ref_id: '894789-43954',
  //                 phone: '+91 9988776543',
  //                 email: 'supportperson@gmail.com'
  //               }
  //             }
  //           }
  //         ]
  //       }

  //       const [trackResponse, supportResponse] = await Promise.all([
  //         axios.post(`${apiUrl}/track`, trackPayload),
  //         axios.post(`${apiUrl}/support`, supportPayload)
  //       ])

  //       if (!isEmpty(trackResponse.data) && !isEmpty(supportResponse.data)) {
  //         console.log('Dank support', supportResponse.data)
  //         setData(prevState => ({
  //           ...prevState,
  //           trackUrl: trackResponse.data.data[0].message && trackResponse.data.data[0].message.tracking.url,
  //           supportData: {
  //             email: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.email,
  //             phone: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.phone
  //           }
  //         }))

  //         setUiState(prevState => ({
  //           ...prevState,
  //           isLoadingForTrackAndSupport: false
  //         }))
  //       }
  //     }
  //     setUiState(prevState => ({
  //       ...prevState,
  //       isLoadingForTrackAndSupport: false
  //     }))
  //   } catch (error) {
  //     setUiState(prevState => ({
  //       ...prevState,
  //       isLoadingForTrackAndSupport: false
  //     }))
  //     console.error(error)
  //   }
  // }

  // Display loading state if data is still being fetched
  if (uiState.isLoading && !processState.apiCalled) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.statusLoaderSubText}
        />
      </Box>
    )
  }

  if (isError) {
    return toast.error('Something went wrong', {
      position: 'top-center'
    })
  }

  if (!data.confirmData?.length && !localStorage.getItem('selectedOrder')) {
    return <></>
  }

  // const handleCancelButton = async (
  //   confirmData: ConfirmResponseModel[] | null | undefined,
  //   statusData: StatusResponseModel[],
  //   cancellationReason: string
  // ) => {
  //   try {
  //     setUiState(prevState => ({
  //       ...prevState,
  //       isLoadingForCancel: true
  //     }))

  //     if (confirmData && confirmData.length > 0) {
  //       const { transaction_id, bpp_id, bpp_uri, domain } = confirmData[0].context
  //       const orderId = confirmData[0].message.orderId
  //       const cancelPayload = {
  //         data: [
  //           {
  //             context: {
  //               transaction_id: uuidv4(),
  //               bpp_id,
  //               bpp_uri,
  //               domain
  //             },
  //             message: {
  //               order_id: orderId,
  //               cancellation_reason_id: '4',
  //               descriptor: {
  //                 short_desc: cancellationReason
  //               }
  //             }
  //           }
  //         ]
  //       }

  //       const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)

  //       if (cancelResponse.data.data.length > 0) {
  //         router.push('/orderCancellation')
  //       }
  //     } else if (statusData && statusData.length > 0 && localStorage.getItem('selectedOrder')) {
  //       const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
  //       const { orderId } = selectedOrderData
  //       const { transaction_id, bpp_id, bpp_uri, domain } = statusData[0].context
  //       const cancelPayload = {
  //         data: [
  //           {
  //             context: {
  //               transaction_id: uuidv4(),
  //               bpp_id,
  //               bpp_uri,
  //               domain
  //             },
  //             message: {
  //               order_id: orderId,
  //               cancellation_reason_id: '4',
  //               descriptor: {
  //                 short_desc: cancellationReason
  //               }
  //             }
  //           }
  //         ]
  //       }

  //       const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)
  //       if (cancelResponse.data.data.length > 0) {
  //         router.push('/orderCancellation')
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setUiState(prevState => ({
  //       ...prevState,
  //       isLoadingForCancel: false
  //     }))
  //   }
  // }

  const statusOrderData = data.statusData?.[0]?.message
  const {
    billing,
    fulfillments,
    quote: { breakup, price }
  } = statusOrderData?.order
  const { address, name, phone } = billing
  const {
    customer: {
      contact: { phone: shippingPhone, email: shippingEmail } = {},
      person: { name: shippingName } = {}
    } = {},
    stops
  } = fulfillments[0]

  const {
    location: { address: shipmentAddress },
    contact: { phone: updateShippingPhone, email: updatedShippingEmail, name: updatedShippingName }
  } = stops[0]

  console.log('Dank', stops, updateShippingPhone, updatedShippingName)

  const filteredOrder = data.statusData.filter(res => {
    const { state } = res.message.order.fulfillments[0]
    return state && res.message.order.fulfillments[0].state.descriptor?.code?.toLowerCase() === 'delivered'
  })

  const totalQuantityOfOrder = (data: DataState) => {
    let count = 0
    data.statusData[0].message.order.items.forEach((item: Item) => {
      count += (item.quantity as QuantityDetails)?.selected?.count
    })
    return count
  }

  const getItemsWithQuantity = () => {
    const cartItemQuantity: any = {}
    data.statusData[0].message.order.items.forEach((item: any) => {
      cartItemQuantity[item.id] = {
        id: item.id,
        quantity: item.quantity.selected.count
      }
    })
    return cartItemQuantity
  }

  const getQRCodeData = () => {
    const orderConfirmationData = JSON.parse(localStorage.getItem('statusResponse')!)
    if (orderConfirmationData) {
      const totalItemsStr = extractItemsWithProvider(orderConfirmationData[0].message.order.items[0].name)
      const createdAt = Math.floor(new Date(orderConfirmationData[0].message?.order?.created_at).getTime() / 1000)
      const generatedOrderId = orderConfirmationData[0].message.order.id
      const { bpp_id, bpp_uri } = orderConfirmationData[0].context

      const statusPayload = {
        data: [
          {
            context: {
              transaction_id: uuidv4(),
              bpp_id,
              bpp_uri,
              domain: type === 'MY_STORE' ? DOMAIN_PATH.MY_STORE : DOMAIN_PATH.RENT_AND_HIRE
            },
            message: {
              order_id: generatedOrderId,
              orderId: generatedOrderId
            }
          }
        ]
      }
      // Use a more compact data structure
      const data = {
        userId: user?.id || null,
        userPhone: user?.agent?.agent_profile.phone_number || 0,
        name: totalItemsStr,
        source: 'spark',
        createdAt: createdAt,
        generatedOrderId: generatedOrderId,
        payload: statusPayload
      }

      return data
    }
    return ''
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY="scroll"
    >
      <Box
        maxW={{ base: '100%', md: '50%' }}
        margin="0 auto"
        data-test={testIds.order_feedback_container}
      ></Box>
      <Box
        display={{ base: 'block', lg: 'flex' }}
        justifyContent="space-between"
        gap="3rem"
      >
        <Box width={{ base: '100%', lg: '80%' }}>
          <Flex
            pb="15px"
            pt="20px"
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_orderOverview}
              text={t.orderOverview}
              fontSize="17px"
            />
            {type === 'MY_STORE' && processState.allOrderDelivered && (
              <BecknButton
                text="Add to wallet"
                handleClick={() => handleOnAddToPhysicalAsset(localStorage.getItem('statusResponse'))}
                color="#FFFFFF"
                variant="solid"
                sx={{
                  fontWeight: '500',
                  fontSize: '12px',
                  width: '7.5rem',
                  height: '0.4rem',
                  padding: '1rem !important',
                  marginBottom: '0 !important'
                }}
              />
            )}
          </Flex>

          <DetailCard>
            <Flex>
              <Image
                mr={'15px'}
                height={['60px', '80px', '80px', '80px']}
                w={['40px', '80px', '80px', '80px']}
                src={data.statusData[0]?.message?.order?.items[0]?.images?.[0].url}
                alt="product image"
              />
              <Box w={'100%'}>
                <Box
                  pt={'unset'}
                  pb={4}
                >
                  <Typography
                    variant="subTitleSemibold"
                    dataTest={testIds.orderDetailspage_productName}
                    text={data.statusData[0]?.message?.order?.items[0]?.name}
                  />
                </Box>

                <Flex
                  pt={'unset'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="subTitleRegular"
                    text={t.placedAt}
                  />
                  <Typography
                    variant="subTitleRegular"
                    dataTest={testIds.orderDetailspage_productPlacedAt}
                    text={formatTimestamp(statusOrderData?.order?.created_at)}
                  />
                </Flex>
              </Box>
            </Flex>
          </DetailCard>

          {/* Display progress summary */}
          <Box
            pb="15px"
            pt="20px"
          >
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_progressSummary}
              text={t.progressSummary}
              fontSize="17px"
            />
          </Box>

          {/* Display order status details */}
          <DetailCard>
            <CardBody p={'unset'}>
              <>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    as={Typography}
                    // TODO
                    text={`Order Id: ${JSON.parse(localStorage.getItem('selectedOrder')!).orderId}`}
                    dataTest={testIds.orderDetailspage_orderId}
                    fontSize="17px"
                    fontWeight="600"
                  />
                  {/* <Image
                    onClick={handleOrderDotsClick}
                    src="/images/threeDots.svg"
                    data-test={testIds.orderDetailspage_otherOptions}
                    alt="threeDots"
                    cursor={'pointer'}
                  /> */}
                </Flex>

                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Flex maxWidth={'40vw'}>
                    <Text
                      textOverflow={'ellipsis'}
                      overflow={'hidden'}
                      whiteSpace={'nowrap'}
                      fontSize={'12px'}
                      fontWeight={'400'}
                      data-test={testIds.orderDetailspage_orderSummaryItemName}
                    >
                      {data.statusData[0]?.message?.order?.items[0]?.name}
                    </Text>
                    {totalQuantityOfOrder(data) > 1 && (
                      <Text
                        pl={'5px'}
                        color={'green'}
                        fontSize={'12px'}
                        fontWeight={'600'}
                        data-test={testIds.orderDetailspage_orderSummaryTotalItems}
                        onClick={onOpen}
                      >
                        +{totalQuantityOfOrder(data) - 1}
                      </Text>
                    )}
                  </Flex>

                  <Text
                    fontSize={'15px'}
                    fontWeight={'500'}
                    data-test={testIds.orderDetailspage_orderStatus}
                    color={data.statusData[0].message.order.status === 'CANCELLED' ? 'red' : 'green'}
                  >
                    {data.statusData[0].message.order.status === 'ACTIVE'
                      ? 'COMPLETED'
                      : data.statusData[0].message.order.status}
                  </Text>
                </Flex>
              </>
              <Divider
                mr={'-20px'}
                ml="-20px"
                width={'unset'}
                pt="15px"
              />
              {/* <ViewMoreOrderModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                items={data.statusData[0].message.order.items}
                orderId={`${orderMetaData.orderIds[0].slice(0, 5)}...`}
                dataTest={testIds.orderDetailspage_viewMoreOrders}
              /> */}

              {/* Display order status progress */}
              <Box
                className="order_status_progress"
                data-test={testIds.orderDetailspage_orderStatusMap}
              >
                {orderStatusMap.map((status: OrderStatusProgressProps, index: number) => (
                  <OrderStatusProgress
                    key={index}
                    label={status.label}
                    statusTime={status.statusTime && formatTimestamp(status.statusTime)}
                    noLine={isDelivered || isCancelled}
                    lastElement={orderStatusMap.length - 1 === index}
                  />
                ))}
              </Box>
            </CardBody>
          </DetailCard>
        </Box>

        {/* shipping and billing address */}

        <Box
          display="flex"
          flexDir={{ base: 'column', lg: 'column' }}
          gap="1rem"
        >
          {isDesktop && (
            <ShippingBlock
              title={t.shipping}
              name={{ text: name!, icon: nameIcon }}
              address={{ text: address, icon: locationIcon }}
              mobile={{ text: phone!, icon: CallphoneIcon }}
              dataTest={testIds.orderDetailspage_shippingDetails}
            />
          )}
          {!isDesktop && (
            <Accordion accordionHeader={t.shipping}>
              <ShippingBlock
                // title={t.shipping}
                name={{ text: name!, icon: nameIcon }}
                address={{ text: address, icon: locationIcon }}
                mobile={{ text: phone!, icon: CallphoneIcon }}
                dataTest={testIds.orderDetailspage_shippingDetails}
              />
            </Accordion>
          )}

          {isDesktop && (
            <ShippingBlock
              title={t.billing}
              name={{ text: name, icon: nameIcon }}
              address={{ text: address, icon: locationIcon }}
              mobile={{ text: phone, icon: CallphoneIcon }}
              dataTest={testIds.orderDetailspage_billingDetails}
            />
          )}
          {!isDesktop && (
            <Accordion accordionHeader={t.billing}>
              <ShippingBlock
                // title={t.shipping}
                name={{ text: name, icon: nameIcon }}
                address={{ text: address, icon: locationIcon }}
                mobile={{ text: phone, icon: CallphoneIcon }}
                dataTest={testIds.orderDetailspage_billingDetails}
              />
            </Accordion>
          )}

          {isDesktop && (
            <Box>
              <PaymentDetails
                title="Payment"
                hasBoxShadow={true}
                paymentBreakDown={getPaymentBreakDown(data.statusData, getItemsWithQuantity()).breakUpMap}
                totalText="Total"
                totalValueWithCurrency={
                  getPaymentBreakDown(data.statusData, getItemsWithQuantity()).totalPricewithCurrent
                }
                dataTest={testIds.orderDetailspage_paymentDetails}
              />
            </Box>
          )}

          {!isDesktop && (
            <Accordion accordionHeader={t.payment}>
              <Box
                pl={'14px'}
                pr={'11px'}
                pb={'11px'}
                pt={'6px'}
              >
                <PaymentDetails
                  paymentBreakDown={getPaymentBreakDown(data.statusData, getItemsWithQuantity()).breakUpMap}
                  totalText="Total"
                  totalValueWithCurrency={
                    getPaymentBreakDown(data.statusData, getItemsWithQuantity()).totalPricewithCurrent
                  }
                  dataTest={testIds.orderDetailspage_paymentDetails}
                />
              </Box>
            </Accordion>
          )}

          <Accordion accordionHeader={'QR Code'}>
            <HStack
              justifyContent={'center'}
              alignItems={'center'}
              pb={'20px'}
            >
              <QRCodeGenerator inputValue={getQRCodeData() || ''} />
            </HStack>
          </Accordion>

          {/* Display main bottom modal */}
          <BottomModal
            title=""
            isOpen={uiState.isMenuModalOpen}
            dataTest={testIds.orderDetailspage_menus}
            onClose={handleMenuModalClose}
          >
            {uiState.isLoadingForTrackAndSupport ? (
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent={'center'}
                height={'300px'}
              >
                <LoaderWithMessage
                  loadingText={t.pleaseWait}
                  loadingSubText={t.fetchingTrackLoaderSubtext}
                />
              </Box>
            ) : (
              <Stack
                gap="20px"
                p={'20px 0px'}
              >
                {menuItems(data.trackUrl as string).map((menuItem, index) => (
                  <Flex
                    key={index}
                    columnGap="10px"
                    alignItems="center"
                    onClick={menuItem.onClick}
                    cursor={'pointer'}
                    data-test={testIds.orderDetailspage_menuItem}
                  >
                    <Image src={menuItem.image} />
                    <Text
                      as={Typography}
                      text={menuItem.text as string}
                      fontSize="15px"
                      dataTest={testIds.orderDetailspage_menuItemName}
                      fontWeight={400}
                    />
                  </Flex>
                ))}
                <Divider />
                {callMenuItem(data.supportData as SupportModel).map((menuItem, index) => (
                  <Flex
                    key={index}
                    columnGap="10px"
                    alignItems="center"
                    onClick={menuItem.onClick}
                    cursor={'pointer'}
                    data-test={testIds.orderDetailspage_callServiceItem}
                  >
                    <Image src={menuItem.image} />
                    <Text
                      as={Typography}
                      text={menuItem.text}
                      dataTest={testIds.orderDetailspage_callServiceItemName}
                      fontSize="15px"
                      fontWeight={400}
                    />
                  </Flex>
                ))}
              </Stack>
            )}
          </BottomModal>

          {/* Display cancellation bottom modal */}
          {/* <BottomModalScan
            isOpen={uiState.isCancelMenuModalOpen}
            onClose={handleCancelMenuModalClose}
            modalHeader={t.orderCancellation}
            dataTest={testIds.orderDetailspage_cancelOrder}
          >
            {uiState.isLoadingForCancel ? (
              <LoaderWithMessage
                loadingText={t.pleaseWait}
                loadingSubText={t.cancelLoaderSubText}
              />
            ) : (
              <>
                <Text
                  as={Typography}
                  text={t.pleaseSelectReason}
                  fontSize="15px"
                  fontWeight={500}
                  textAlign="center"
                  pb="20px"
                />
                <RadioGroup
                  onChange={value => {
                    setProcessState(prevValue => ({
                      ...prevValue,
                      radioValue: value
                    }))
                    setUiState(prevValue => ({
                      ...prevValue,
                      isProceedDisabled: false
                    }))
                  }}
                  value={processState.radioValue}
                  pl="20px"
                >
                  {orderCancelReason.map(reasonObj => (
                    <Stack
                      pb="10px"
                      direction="column"
                      key={reasonObj.id}
                    >
                      <Radio value={reasonObj.reason}>{reasonObj.reason}</Radio>
                    </Stack>
                  ))}
                </RadioGroup>
                <Textarea
                  w="332px"
                  m="20px"
                  height="124px"
                  resize="none"
                  placeholder="Please specify the reason"
                  boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)"
                />
                <Box m="20px">
                  <BecknButton
                    disabled={uiState.isProceedDisabled}
                    children="Proceed"
                    className="checkout_btn"
                    handleClick={() => {
                      dispatch(statusActions.addStatusResponse({ statusResponse: data.statusData }))
                      handleCancelButton(
                        data.confirmData as ConfirmResponseModel[],
                        data.statusData as StatusResponseModel[],
                        processState.radioValue
                      )
                    }}
                  />
                </Box>
              </>
            )}
          </BottomModalScan> */}
        </Box>
      </Box>
    </Box>
  )
}

export default OrderDetails
