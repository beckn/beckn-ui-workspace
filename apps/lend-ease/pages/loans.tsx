import { Box, Image } from '@chakra-ui/react'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { buttonStyles } from '@components/constant'
import { useRouter } from 'next/router'
import React from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { SlEnergy } from 'react-icons/sl'

const loans = () => {
  const router = useRouter()
  return (
    <Box>
      <ShadowCardButton
        prefixIcon={<SlEnergy />}
        text="Energy Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/energyFinance')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/house.svg" />}
        text="Home Loans"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/directions_car.svg" />}
        text="Vehicle Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/money_bag.svg" />}
        text="Personal Loan"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
    </Box>
  )
}

export default loans
