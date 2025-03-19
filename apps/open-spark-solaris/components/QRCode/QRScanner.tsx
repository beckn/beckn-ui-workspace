import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { Box, Flex, Image, Modal, ModalContent, ModalHeader, ModalOverlay, Spinner, useTheme } from '@chakra-ui/react'
import pako from 'pako'
import BottomModalScan from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Typography } from '@beckn-ui/molecules'
import { keyframes } from '@emotion/react'

const scanAnimation = keyframes`
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
`

interface QRCodeScannerProps {
  showScanner: boolean
  setScannedData: (data: any) => void
  setShowScanner: (show: boolean) => void
}

interface ViewFinderProps {
  onClose: () => void
}

const ViewFinder: React.FC<ViewFinderProps> = ({ onClose }) => {
  const theme = useTheme()
  const secondaryColor = theme.colors.secondary['100']

  return (
    <>
      <Flex
        position="absolute"
        top="0"
        left="0"
        background={'#ffffff9e'}
        width="100%"
        justifyContent={'center'}
      >
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          padding={'20px 10px'}
        >
          <Typography
            text="Scan QR Code"
            fontSize="16px"
            fontWeight="800"
            color={secondaryColor}
          />
        </Flex>
        <Box
          onClick={onClose}
          cursor={'pointer'}
          opacity={1}
          alignContent="center"
          pos={'absolute'}
          right={'1rem'}
          top={'23px'}
        >
          <Image src="/images/crossIcon.svg" />
        </Box>
      </Flex>

      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="90%"
        height="40%"
        border="none"
        borderRadius="12px"
        boxShadow="0 0 30px rgb(242 255 242 / 70%)"
        pointerEvents="none"
      >
        {/* Scanning Line */}
        <Box
          position="absolute"
          width="100%"
          height="4px"
          backgroundColor="#EDEDED"
          animation={`${scanAnimation} 3s linear infinite`}
        />
        {/* Corner markers */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
          <Box
            key={pos}
            position="absolute"
            {...(pos.includes('top') ? { top: 0 } : { bottom: 0 })}
            {...(pos.includes('left') ? { left: 0 } : { right: 0 })}
            borderTop={pos.includes('top') ? '4px solid #EDEDED' : 'none'}
            borderBottom={pos.includes('bottom') ? '4px solid #EDEDED' : 'none'}
            borderLeft={pos.includes('left') ? '4px solid #EDEDED' : 'none'}
            borderRight={pos.includes('right') ? '4px solid #EDEDED' : 'none'}
            width="30px"
            height="30px"
            borderRadius="6px"
          />
        ))}
      </Box>
    </>
  )
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ showScanner, setShowScanner, setScannedData }) => {
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const videoElement = document.getElementById('qr-scanner') as HTMLVideoElement
      if (videoElement && videoElement.readyState === 4) {
        setVideoReady(true)
        clearInterval(intervalId)
      }
    }, 100)

    return () => {
      clearInterval(intervalId)
      setVideoReady(false)
    }
  }, [showScanner])

  const decodeQRCodeData = (compressedData: string) => {
    try {
      const decodedBase64 = Uint8Array.from(atob(compressedData.replace(/-/g, '+').replace(/_/g, '/')), c =>
        c.charCodeAt(0)
      )

      const decompressedData = pako.inflate(decodedBase64, { to: 'string' })

      return JSON.parse(decompressedData)
    } catch (error) {
      console.error('Error decoding data:', error)
      return 'Invalid QR Data'
    }
  }

  const handleScanQrCode = (compressedData: any) => {
    console.log('compressedData -->', compressedData)
    return decodeQRCodeData(compressedData)
  }

  const handleResult = (result: any, error: any) => {
    if (result) {
      const extractedData = handleScanQrCode(result.text)
      console.log('Extracted Data:', extractedData)
      setScannedData(extractedData)
      handleOnClose()
    }

    if (error) {
      console.error('Error scanning QR code:', error)
    }
  }

  const handleOnClose = () => {
    setShowScanner(false)
  }

  return (
    <Modal
      isCentered
      isOpen={showScanner}
      onClose={handleOnClose}
      scrollBehavior="outside"
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
    >
      <ModalOverlay height="100vh" />
      <ModalContent
        position="fixed"
        bottom="0px"
        borderRadius="1rem 1rem 0px 0px"
        maxW="lg"
        maxH={'100%'}
        background={'transparent'}
      >
        <Box
          position="relative"
          width="100%"
          height="calc(100vh - 6rem)"
        >
          {!videoReady && (
            <Flex
              align="center"
              justify="center"
              height="100%"
              bg="blackAlpha.800"
              color="white"
              background={'none'}
            >
              <Spinner size="xl" />
            </Flex>
          )}

          <QrReader
            onResult={handleResult}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%', height: '100%' }}
            videoContainerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
            videoId={'qr-scanner'}
          />
          {videoReady && <ViewFinder onClose={handleOnClose} />}
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default QRCodeScanner
