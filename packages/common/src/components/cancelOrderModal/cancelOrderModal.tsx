import React from 'react'
import { Box, Textarea, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomModalScan from '../BottomModal/BottomModalScan'
import { LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { OrderCancellationModalProps } from './cancelOrderModal.types'

const orderCancelReason = [
  { id: 1, reason: 'Merchant is taking too long' },
  { id: 2, reason: 'Ordered by mistake' },
  { id: 3, reason: 'I’ve changed my mind' },
  { id: 4, reason: 'Other' }
]

const OrderCancellationModal = (props: OrderCancellationModalProps) => {
  const {
    isOpen,
    onClose,
    isLoadingForCancel,
    radioValue,
    isProceedDisabled,
    t,
    handleOnRadioBtnChange,
    handleOnProceedClick
  } = props
  return (
    <BottomModalScan
      isOpen={isOpen}
      onClose={onClose}
      modalHeader={t('orderCancellation')}
    >
      {isLoadingForCancel ? (
        <LoaderWithMessage
          loadingText={t('pleaseWait')}
          loadingSubText={t('cancelLoaderSubText')}
        />
      ) : (
        <Box>
          <Text
            as={Typography}
            text={t('pleaseSelectReason')}
            fontSize="15px"
            fontWeight={500}
            textAlign="center"
            pb="20px"
          />
          <RadioGroup
            onChange={value => handleOnRadioBtnChange(value)}
            value={radioValue}
            pl="20px"
          >
            {orderCancelReason.map(reasonObj => (
              <Stack
                key={reasonObj.id}
                pb="10px"
                direction="column"
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
          <Box m="0 20px">
            <BecknButton
              disabled={isProceedDisabled}
              children="Proceed"
              className="checkout_btn"
              handleClick={handleOnProceedClick}
            />
          </Box>
        </Box>
      )}
    </BottomModalScan>
  )
}

export default OrderCancellationModal
