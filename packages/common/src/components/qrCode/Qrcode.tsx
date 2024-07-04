import { QRCodeCanvas } from 'qrcode.react'
import React from 'react'
import { Box } from '@chakra-ui/react'
import Style from './QrCode.module.css'
import { QrCodeProps } from './QrCode.types'

const Qrcode = ({ value }: QrCodeProps) => {
  return (
    <Box className={Style.qrCode_tourism}>
      <QRCodeCanvas value={value} />
    </Box>
  )
}

export default Qrcode
