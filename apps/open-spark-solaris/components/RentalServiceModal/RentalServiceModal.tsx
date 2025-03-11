import React, { useRef, useState } from 'react'
import { BottomModal, Loader, Typography } from '@beckn-ui/molecules'
import {
  Box,
  Flex,
  Input,
  Text,
  Step,
  StepIndicator,
  StepStatus,
  Stepper,
  useSteps,
  Circle,
  StepSeparator,
  Button,
  Progress,
  VStack,
  Icon,
  HStack
} from '@chakra-ui/react'
import { CheckIcon, AddIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'
import { decodeStream, useDecodeStreamMutation, useGetDocumentsMutation } from '@services/walletService'
import { parseDIDData } from '@utils/did'
import { feedbackActions, formatDate } from '@beckn-ui/common'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import VerifiedIcon from '@public/images/verified.svg'
import UnverifiedIcon from '@public/images/unverified.svg'
import { ItemMetaData } from '@lib/types/becknDid'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import CustomDatePicker from '@components/dateTimePicker/customDatePicker'
import CustomTimePicker from '@components/dateTimePicker/customTimePicker'
import { validateStartEndTime } from '@utils/general'
import { FiPlusCircle } from 'react-icons/fi'

interface RentalServiceModalProps {
  isOpen: boolean
  onClose: () => void
  handleOnSubmit: ({ success, startLoading }: { success: boolean; startLoading: boolean }) => void
}

const steps = [{ title: 'Add Asset' }, { title: 'Add Price & Duration' }]

interface FileUploadInfo {
  name: string
  size: string
  progress: number
}

interface BatteryOption {
  id: string
  name: string
  source: string
  invoice: string
  timestamp: string
  isSelected?: boolean
  isVerified?: boolean
  data?: any
}

const RentalServiceModal: React.FC<RentalServiceModalProps> = ({ isOpen, onClose, handleOnSubmit }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length
  })

  const [uploadedFile, setUploadedFile] = useState<FileUploadInfo | null>(null)
  const [currentView, setCurrentView] = useState<'upload' | 'select' | 'pricing'>('upload')
  const [selectedBattery, setSelectedBattery] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [price, setPrice] = useState<string>('100')
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [confirmResOfWalletCatalogue, setConfirmResOfWalletCatalogue] = useState<any>(null)
  const [showTimeError, setShowTimeError] = useState(false)

  const [batteryOptions, setBatteryOptions] = useState<BatteryOption[]>([])
  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const [decodeStream] = useDecodeStreamMutation()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const getDecodedStreamData = async (data: any) => {
    console.log(data)
    const decodedRes: any = await decodeStream({ subjectId: data.data.did })
    console.log('Decoded:', decodedRes)
    return decodedRes
  }

  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      const result = await getDocuments(user?.deg_wallet?.deg_wallet_id!).unwrap()
      console.log(result)
      const list: BatteryOption[] = parseDIDData(result)
        ['assets']['physical'].map((item, index) => {
          return {
            id: index.toString(),
            name: item.type,
            source: item.source,
            invoice: item.attachment!,
            isVerified: true,
            timestamp:
              item?.createdAt?.length > 5 && !isNaN(item?.createdAt as number)
                ? item.createdAt
                : Math.floor(new Date().getTime() / 1000),
            data: item
          }
        })
        .filter(val => val && val.source.toLocaleLowerCase() !== 'wallet')
        .sort((a, b) => Number(b.data.createdAt) - Number(a.data.createdAt))
      setBatteryOptions(list)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFromWallet = async () => {
    if (user?.deg_wallet && user?.deg_wallet.energy_assets_consent) {
      setCurrentView('select')
      setActiveStep(0)
      console.log(user?.deg_wallet?.deg_wallet_id)
      const getDoc = await fetchCredentials()
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

  const handlePublish = async () => {
    //TODO:Aniket Generate this payload using wallet
    handleOnSubmit({ startLoading: true, success: true })
    const confirmRes = await getDecodedStreamData(confirmResOfWalletCatalogue)
    console.log('Confirm Res:', confirmRes.data.confirmDetails[0])

    const payload = {
      providerDetails: {
        data: [{ ...confirmRes.data.confirmDetails[0], message: confirmRes.data.confirmDetails[0].message.order }]
      },
      walletId: user?.deg_wallet?.deg_wallet_id,
      startTime: `${Math.floor(new Date(fromTime).getTime() / 1000)}`,
      endTime: `${Math.floor(new Date(toTime).getTime() / 1000)}`,
      price: price.toString(),
      date: date
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/unified-beckn-energy/rent-catalogue`,
        payload,
        {
          headers: axiosConfig.headers
        }
      )

      const data = response.data
      console.log('API Response:', data)
      handleClose()
      handleOnSubmit({ startLoading: false, success: true })
      dispatch(
        feedbackActions.setToastData({
          toastData: { message: 'Success', display: true, type: 'success', description: 'Published Successfully!' }
        })
      )
    } catch (error) {
      console.error('Error making API call:', error)
      throw error
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File:', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)}kb`,
        progress: 100
      })
    }
  }

  const handleNext = () => {
    setCurrentView('pricing')
    setActiveStep(1)
  }

  const handlePricing = () => {
    setCurrentView('pricing')
    setActiveStep(1)
  }

  // Reset state when modal closes
  const handleClose = () => {
    setActiveStep(0)
    setCurrentView('upload')
    setSelectedBattery(null)
    setUploadedFile(null)
    setBatteryOptions([])
    onClose()
  }
  console.log(batteryOptions)

  // Add this helper function to round up time to nearest hour
  const roundToNextHour = (date: Date) => {
    const roundedDate = new Date(date)
    // If minutes are not 0, round up to next hour
    if (roundedDate.getMinutes() > 0) {
      roundedDate.setHours(roundedDate.getHours() + 1)
    }
    roundedDate.setMinutes(0)
    roundedDate.setSeconds(0)
    roundedDate.setMilliseconds(0)
    return roundedDate
  }

  // Initialize with rounded current time
  const [fromTime, setFromTime] = useState<Date>(roundToNextHour(new Date()))
  const [toTime, setToTime] = useState<Date>(() => {
    const initialEndTime = roundToNextHour(new Date())
    initialEndTime.setHours(initialEndTime.getHours() + 1)
    return initialEndTime
  })

  // Update the time change handlers
  const handleFromTimeChange = (date: Date) => {
    const roundedTime = roundToNextHour(date)
    setFromTime(roundedTime)
  }

  const handleToTimeChange = (date: Date) => {
    const roundedTime = roundToNextHour(date)
    setToTime(roundedTime)
  }

  // Add this helper function at the top of the component
  const isToday = (dateToCheck: Date) => {
    const today = new Date()
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    )
  }

  // Add this helper function to check if a time is in the past
  const isTimePast = (timeToCheck: Date) => {
    const now = new Date()
    return timeToCheck.getTime() < now.getTime()
  }

  const renderContent = () => {
    if (currentView === 'upload') {
      return (
        <>
          <Box p={4}>
            <Text
              textAlign={'center'}
              color="#858585"
              fontSize={'14px'}
            >
              Click on "Add from wallet" to fetch your battery for renting!
            </Text>
          </Box>

          <BecknButton
            text="Add from wallet"
            handleClick={handleAddFromWallet}
          />

          {batteryOptions.length > 0 && (
            <BecknButton
              text="Next"
              handleClick={handleNext}
            />
          )}
        </>
      )
    }

    if (currentView === 'select') {
      return (
        <Box>
          <Box
            className="hideScroll"
            maxH={{ base: 'calc(100vh - 500px)', md: 'calc(100vh - 600px)', lg: 'calc(100vh - 600px)' }}
            overflowY={'scroll'}
            p="0 4px"
          >
            {batteryOptions.map(battery => (
              <Box
                key={battery.id}
                mb={4}
                p={4}
                borderRadius="md"
                border="0.5px solid #E2E8F0"
                cursor="pointer"
                onClick={() => {
                  setSelectedBattery(battery.id)
                  setConfirmResOfWalletCatalogue(battery)
                }}
                position="relative"
                bg="white"
                boxShadow="2px 12px 12px -2px #0000001A"
              >
                <Flex align="center">
                  <Circle
                    size="20px"
                    border="1px solid"
                    borderColor={selectedBattery === battery.id ? '#228B22' : '#E2E8F0'}
                    mr={3}
                  >
                    {selectedBattery === battery.id && (
                      <Circle
                        size="12px"
                        bg="#228B22"
                      />
                    )}
                  </Circle>
                  <Box>
                    <Flex align="center">
                      <Image
                        src="/images/battery_icon.svg"
                        alt="Battery Box"
                        width={65}
                        height={65}
                        style={{ marginRight: '16px' }}
                      />
                      <Box>
                        <Flex>
                          <Text
                            fontSize="12px"
                            fontWeight="500"
                            mb={1}
                            noOfLines={2}
                            textOverflow="ellipsis"
                            whiteSpace="pre-wrap"
                            overflowWrap="break-word"
                          >
                            {battery.name}
                          </Text>
                        </Flex>
                        <Flex>
                          <Text
                            fontSize="13px"
                            color="gray.600"
                            fontWeight={'600'}
                            mb={1}
                          >
                            {`Source:`}
                          </Text>
                          <Text
                            fontSize="13px"
                            color="gray.600"
                            mb={1}
                            ml={1}
                            textTransform="capitalize"
                          >
                            {`${battery.source}`}
                          </Text>
                        </Flex>
                        <Text
                          fontSize="12px"
                          color="#228B22"
                          textDecoration="underline"
                          mb={1}
                        >
                          {battery.invoice}
                        </Text>
                        <Text
                          fontSize="12px"
                          color="gray.500"
                        >
                          {formatDate((Number(battery?.timestamp) * 1000)!, 'do MMM yyyy, h.mma')}
                        </Text>
                        {/* <Text>{battery.data.attestation.length}</Text> */}
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>

          {batteryOptions.length > 0 && (
            <BecknButton
              text="Next"
              handleClick={handleNext}
              disabled={!selectedBattery}
            />
          )}
          {batteryOptions.length === 0 && (
            <>
              <Box p={4}>
                <Text
                  textAlign={'center'}
                  color="#858585"
                  fontSize={'14px'}
                >
                  No Assets found
                </Text>
              </Box>
              <BecknButton
                text="Back"
                handleClick={() => setCurrentView('upload')}
              />
            </>
          )}
        </Box>
      )
    }

    // Pricing View (third screen)
    return (
      <Box>
        <Box mb={6}>
          <Text
            mb={3}
            fontSize="16px"
          >
            Date
          </Text>
          <Flex align="center">
            <CustomDatePicker
              selected={new Date(date)}
              placeholderText="Select 'from' date"
              onChange={(date: any) => {
                setDate(date?.toISOString())
                setFromTime(roundToNextHour(new Date(date)))
                setToTime(roundToNextHour(new Date(date)))
              }}
              dateFormat="dd-MM-yyyy"
              isInvalid={false}
            />
          </Flex>
        </Box>

        <Box mb={6}>
          <Text
            mb={3}
            fontSize="16px"
          >
            Time
          </Text>
          <Flex
            align="center"
            flexDir={'column'}
          >
            <Flex align="center">
              <CustomTimePicker
                selected={fromTime}
                placeholderText="Select 'from'"
                onChange={handleFromTimeChange}
                dateFormat="h:mm aa"
                isInvalid={false}
                minTime={isToday(new Date(date)) ? new Date() : undefined}
              />
              <Text mx={3}>-</Text>
              <CustomTimePicker
                selected={toTime}
                placeholderText="Select 'to'"
                onChange={handleToTimeChange}
                dateFormat="h:mm aa"
                isInvalid={false}
                minTime={
                  isToday(new Date(date))
                    ? fromTime.getTime() > new Date().getTime()
                      ? fromTime
                      : new Date()
                    : fromTime
                }
              />
            </Flex>
          </Flex>
        </Box>

        <Box mb={6}>
          <Text
            mb={3}
            fontSize="16px"
          >
            Price
          </Text>
          <Flex align="center">
            <Input
              type="number"
              value={price}
              autoFocus={true}
              width="100px"
              borderRadius="md"
              mr={3}
              onChange={e => setPrice(e.target.value)}
              onKeyDown={e => {
                // Prevent negative numbers and 'e'
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault()
                }
                // Prevent down arrow key when value is 1 or less
                if (e.key === 'ArrowDown' && parseInt(price) <= 1) {
                  e.preventDefault()
                }
              }}
            />
            <Text color="gray.600">Rs. per hour</Text>
          </Flex>
        </Box>
        <BecknButton
          text={'Submit & Publish'}
          handleClick={handlePublish}
          disabled={
            fromTime.getTime() === toTime.getTime() ||
            (isToday(new Date(date)) && (isTimePast(fromTime) || isTimePast(toTime))) ||
            toTime.getTime() < fromTime.getTime()
          }
        />
      </Box>
    )
  }

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <Flex
          justify="space-between"
          align="center"
          width="100%"
        >
          <Typography
            text="Provide Rental Service"
            fontSize="16px"
          />
        </Flex>
      }
    >
      <Box p={'10px 4px'}>
        <Stepper
          index={activeStep}
          colorScheme="blue"
          size="sm"
          gap={2}
          mb={2}
          mr={12}
          ml={7}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={
                    <Circle
                      size="24px"
                      bg="#228B22"
                      color="white"
                    >
                      <CheckIcon />
                    </Circle>
                  }
                  incomplete={
                    <Circle
                      size="24px"
                      bg="transparent"
                      color="#228B22"
                      border="1px solid #228B22"
                    >
                      {index + 1}
                    </Circle>
                  }
                  active={
                    <Circle
                      size="24px"
                      bg="#228B22"
                      color="white"
                    >
                      <CheckIcon />
                    </Circle>
                  }
                />
              </StepIndicator>
              <StepSeparator
                _horizontal={{
                  ml: '0',
                  height: '4px'
                }}
                background="#228B22 !important"
              />
            </Step>
          ))}
        </Stepper>

        <Flex
          justify="space-between"
          // mb={6}
          gap={2}
          mb={2}
          mr={'0.9rem'}
          ml={'0.9rem'}
        >
          {steps.map((step, index) => (
            <Text
              key={index}
              fontSize="10px"
              color={activeStep >= index ? '#228B22' : '#6B7280'}
              textAlign="center"
              maxW="110px"
              onClick={() => {
                if (index === 0) {
                  setCurrentView('upload')
                  setActiveStep(0)
                  setBatteryOptions([])
                }
              }}
            >
              {step.title}
            </Text>
          ))}
        </Flex>

        {isLoading ? (
          <>
            <Box
              display={'grid'}
              height={'calc(100vh - 510px)'}
              alignContent={'center'}
            >
              <Loader />
            </Box>
          </>
        ) : (
          renderContent()
        )}
      </Box>
    </BottomModal>
  )
}

export default RentalServiceModal
