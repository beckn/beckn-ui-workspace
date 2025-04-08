import React from 'react'
import QRCode from 'react-qr-code'
import pako from 'pako'

interface QRCodeGeneratorProps {
  inputValue: any
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ inputValue }) => {
  const compressData = (data: any) => {
    const reducedData = data
    const compressedData = pako.deflate(JSON.stringify(reducedData), { level: 9 })

    return Buffer.from(compressedData).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  const qrData = compressData(inputValue)

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {qrData ? (
        <QRCode
          value={qrData}
          size={200}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  )
}

export default QRCodeGenerator
