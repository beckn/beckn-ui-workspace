import React from 'react'
import { Flex, Image } from '@chakra-ui/react'

import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

interface ButtonStyles {
  color: string
  borderColor: string
  backgroundColor: string
  cursor: string
  fontSize: string
  padding: string
  borderRadius: string
  height: string
  marginBottom: string
  [key: string]: string
}

interface BalanceCardProps {
  backgroundColor: string
  currentBalanceText: string
  balanceAmount: string
  withdrawText: string
  depositText: string
  onWithdraw: () => void
  onDeposit: () => void
  buttonSx: ButtonStyles
  withdrawIcon: string
  depositIcon: string
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  backgroundColor,
  currentBalanceText,
  balanceAmount,
  withdrawText,
  depositText,
  onWithdraw,
  onDeposit,
  buttonSx,
  withdrawIcon,
  depositIcon
}) => {
  return (
    <Flex
      width={'335px'}
      height="162px"
      backgroundColor={backgroundColor}
      borderRadius="12px"
      p="1rem"
      flexDir={'column'}
      justifyContent="space-around"
      boxShadow="0px 20px 25px 0px #0000001A"
    >
      <Typography
        text={currentBalanceText}
        fontSize="15px"
        color="#ffffff"
      />
      <Typography
        text={balanceAmount}
        fontSize="24px"
        color="#ffffff"
      />
      <Flex gap="1rem">
        <BecknButton
          text={withdrawText}
          handleClick={onWithdraw}
          variant="outline"
          sx={buttonSx}
          leftIcon={
            <Image
              src={withdrawIcon}
              alt="withdraw-icon"
            />
          }
        />
        <BecknButton
          text={depositText}
          handleClick={onDeposit}
          variant="outline"
          sx={buttonSx}
          leftIcon={
            <Image
              src={depositIcon}
              alt="deposit-icon"
            />
          }
        />
      </Flex>
    </Flex>
  )
}

export default BalanceCard
