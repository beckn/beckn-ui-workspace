import { feedbackActions } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useLanguage } from '@hooks/useLanguage'
import { useVerifyOtpMutation } from '@services/UserService'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'

const numberOfDigits = 6

const OTPVerification = () => {
  const [OTP, setOTP] = useState(new Array(numberOfDigits).fill(''))
  const [, setOTPError] = useState<string | null>(null)
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>([])

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [verifyOtp] = useVerifyOtpMutation()

  useEffect(() => {}, [])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return
    const newArr = [...OTP]
    newArr[index] = value
    setOTP(newArr)

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleBackspaceAndEnter = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value && index > 0) {
      otpBoxReference.current[index - 1].focus()
    }
    if (e.key === 'Enter' && (e.target as HTMLInputElement).value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleVerifyOtp = async () => {
    const data = {
      otp: Number(OTP.join(''))
    }

    try {
      const response = await verifyOtp(data).unwrap()
      Cookies.set('isVerified', 'true')
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: t.success,
            display: true,
            type: 'success',
            description: response.data.message
          }
        })
      )
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <div className="mx-auto max-w-full md:max-w-[40rem] text-center mt-2.5 md:mt-[60px] lg:mt-5">
      <Typography
        text={t.otpDescription}
        fontSize="12px"
        color="#80807F"
        style={{
          textAlign: 'start',
          marginTop: '16px'
        }}
      />
      <div className="flex flex-col justify-between gap-5 min-h-[calc(100vh-650px)]">
        <div className="mt-6">
          <div className="flex gap-4">
            {OTP.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={e => handleChange(e.target.value, index)}
                onKeyUp={e => handleBackspaceAndEnter(e, index)}
                ref={el => {
                  otpBoxReference.current[index] = el
                }}
                className="w-[42px] h-[46px] p-3 bg-[#D9D9D933] border-2 border-[#0000001A] rounded-md text-center text-xl text-[var(--ev-text)] focus:border-blue-400 focus:outline-none focus:ring-0"
              />
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Typography
              text={"Didn't receive OTP?"}
              color={'#80807F'}
            />
            <Typography
              text={'Resend OTP'}
              color={'#4498E8'}
              sx={{
                marginLeft: '5px',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
        <BecknButton
          text="Verify OTP"
          handleClick={handleVerifyOtp}
          dataTest="otp_number"
        />
      </div>
    </div>
  )
}

export default OTPVerification
