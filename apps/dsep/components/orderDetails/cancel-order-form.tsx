import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { RadioGroup, Text, Box, Textarea, Stack, Radio } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { ConfirmResponseModel } from '../../lib/types/confirm.types'
import { StatusResponseModel } from '../../lib/types/status.types'
import { orderCancelReason } from '../../utilities/orderDetails-utils'
import { data } from '../Map/StoreMarkerData'

export interface CancelOrderFormPropsModel {
  radioValue: string
  setRadioValue: React.Dispatch<React.SetStateAction<string>>
  isProceedDisabled: boolean
  setIsProceedDisabled: React.Dispatch<React.SetStateAction<boolean>>
  handleCancelSubmit: any
}

const CancelOrderForm: FC<CancelOrderFormPropsModel> = ({
  isProceedDisabled,
  radioValue,
  setIsProceedDisabled,
  setRadioValue,
  handleCancelSubmit
}) => {
  const { t } = useLanguage()
  return (
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
          setRadioValue(value)
          setIsProceedDisabled(false)
        }}
        value={radioValue}
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
        height="124px"
        resize="none"
        placeholder={t.reasonSpecify}
        boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)"
      />
      <Box m="20px">
        <BecknButton
          disabled={isProceedDisabled}
          children={t.proceedToPay}
          className="checkout_btn"
          //   handleClick={() => {
          //     handleCancelButton(
          //       data.confirmData as ConfirmResponseModel[],
          //       data.statusData as StatusResponseModel[],
          //       processState.radioValue
          //     )
          //   }}
          handleClick={handleCancelSubmit}
        />
      </Box>
    </>
  )
}

export default CancelOrderForm
