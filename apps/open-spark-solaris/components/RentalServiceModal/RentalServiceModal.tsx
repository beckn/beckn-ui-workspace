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
  const [fromTime, setFromTime] = useState<Date>(new Date())
  const [toTime, setToTime] = useState<Date>(new Date())
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [confirmResOfWalletCatalogue, setConfirmResOfWalletCatalogue] = useState<any>(null)
  const [showTimeError, setShowTimeError] = useState(false)

  const [batteryOptions, setBatteryOptions] = useState<BatteryOption[]>([
    // {
    //   id: '1',
    //   name: 'Battery -1',
    //   assetId: '123456',
    //   invoice: 'Invoice.pdf',
    //   timestamp: '21st Jun 2021, 3.30pm'
    // },
    // {
    //   id: '2',
    //   name: 'Battery -2',
    //   assetId: '123456',
    //   invoice: 'Invoice.pdf',
    //   timestamp: '21st Jun 2021, 3.30pm'
    // }
  ])
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
      const list: BatteryOption[] = parseDIDData(result)['assets']['physical'].map((item, index) => {
        return {
          id: index.toString(),
          name: item.type,
          source: item.source,
          invoice: item.attachment!,
          isVerified: true,
          timestamp: new Date().toString(),
          data: item
        }
      })
      setBatteryOptions(list)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFromWallet = async () => {
    setCurrentView('select')
    setActiveStep(0)
    console.log(user?.deg_wallet?.deg_wallet_id)
    const getDoc = await fetchCredentials()
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
      price: price.toString()
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
    onClose()
  }
  console.log(batteryOptions)
  const renderContent = () => {
    if (currentView === 'upload') {
      return (
        <>
          <Box mb={4}>
            <Text mb={2}>Device</Text>
            <Input
              placeholder="Battery"
              value="Battery"
              isReadOnly
            />
          </Box>

          <Box mb={4}>
            <Text mb={2}>Asset ID</Text>
            <Input
              placeholder="MK-0123459"
              value="MK-0123459"
              isReadOnly
            />
          </Box>

          {/* File Upload Section */}
          <Box
            border="1px dashed #E2E8F0"
            borderRadius="md"
            p={4}
            mb={4}
            textAlign="center"
          >
            <input
              type="file"
              id="file-upload"
              disabled={true}
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload">
              <Box
                width={'100%'}
                height={'100%'}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click()
                  }
                }}
              >
                <VStack>
                  <Icon
                    as={FiPlusCircle}
                    boxSize={6}
                    color="gray.500"
                  />
                  <Typography text={'Upload your file here'} />
                  <HStack gap={1}>
                    <Typography
                      color="#4498E8"
                      fontSize="10px"
                      sx={{ cursor: 'pointer', _hover: { textDecoration: 'underline' } }}
                      text="Browse file"
                    />{' '}
                    <Typography
                      fontSize="10px"
                      text={'from your computer'}
                    />
                  </HStack>
                </VStack>
              </Box>
            </label>
          </Box>

          {/* File Preview */}
          {uploadedFile && (
            <Box
              border="1px solid #E2E8F0"
              borderRadius="md"
              p={4}
              mb={4}
            >
              <Flex
                justify="space-between"
                align="center"
              >
                <Flex align="center">
                  <Box
                    as="span"
                    mr={2}
                    color="#228B22"
                  >
                    📄
                  </Box>
                  <Box>
                    <Text>{uploadedFile.name}</Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                    >
                      {uploadedFile.size}
                    </Text>
                  </Box>
                </Flex>
                <CheckIcon color="#228B22" />
              </Flex>
              <Progress
                value={uploadedFile.progress}
                size="sm"
                colorScheme="blue"
                mt={2}
              />
            </Box>
          )}

          <BecknButton
            text="Next"
            handleClick={handleNext}
          />
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
                    <Flex
                      align="center"
                      mb={2}
                    >
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
                          {/* <Box
                          marginTop={'2px'}
                          width="60px"
                        >
                          {battery?.isVerified ? (
                            <Image
                              src={VerifiedIcon}
                              alt=""
                              width={80}
                              height={18}
                            />
                          ) : (
                            <Image
                              src={UnverifiedIcon}
                              alt=""
                              width={80}
                              height={18}
                            />
                          )}
                        </Box> */}
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
                          {formatDate(battery.timestamp, 'do MMM yyyy, h.mma')}
                        </Text>
                        {/* <Text>{battery.data.attestation.length}</Text> */}
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>

          <BecknButton
            text="Next"
            color="white"
            handleClick={handlePricing}
          />
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
              onChange={(date: any) => setDate(date?.toISOString())}
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
                onChange={(date: any) => setFromTime(date)}
                dateFormat="h:mm aa"
                isInvalid={false}
              />
              <Text mx={3}>-</Text>
              <CustomTimePicker
                selected={toTime}
                placeholderText="Select 'to'"
                onChange={(date: any) => setToTime(date)}
                dateFormat="h:mm aa"
                isInvalid={false}
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
              value={price}
              autoFocus={true}
              width="100px"
              borderRadius="md"
              mr={3}
              onChange={e => setPrice(e.target.value)}
            />
            <Text color="gray.600">Rs. per hour</Text>
          </Flex>
        </Box>

        <BecknButton
          text={'Submit & Publish'}
          handleClick={handlePublish}
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
          {currentView === 'upload' && (
            <Text
              color="#228B22"
              fontSize="sm"
              cursor="pointer"
              onClick={handleAddFromWallet}
            >
              Add from wallet
            </Text>
          )}
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
