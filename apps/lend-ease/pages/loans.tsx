import { Box, Image } from '@chakra-ui/react'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { buttonStyles } from '@components/constant'
import { useRouter } from 'next/router'
import React from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { SlEnergy } from 'react-icons/sl'

const loans = () => {
  const router = useRouter()

  const handleLoanTypeNavigation = (type: string, text: string) => {
    // Store option text in localStorage
    localStorage.setItem('selectCardHeaderText', JSON.stringify(text))

    router.push({
      pathname: '/energyFinance',
      query: { type }
    })
  }

  return (
    <Box mt="10px">
      <ShadowCardButton
        prefixIcon={<SlEnergy />}
        text="Energy Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => handleLoanTypeNavigation('loan_type_battery-loan_type_solar', 'Energy Financing')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/house.svg" />}
        text="Home Loans"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => handleLoanTypeNavigation('loan_type_home', 'Home Loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/directions_car.svg" />}
        text="Vehicle Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => handleLoanTypeNavigation('loan_type_vehicle', 'Vehicle Financing')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/money_bag.svg" />}
        text="Personal Loan"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => handleLoanTypeNavigation('loan_type_personal', 'Personal Loan')}
        dataTest="store_button"
        sx={buttonStyles}
      />
    </Box>
  )
}

export default loans
