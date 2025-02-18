import { Box, Image } from '@chakra-ui/react'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { buttonStyles } from '@components/constant'
import { useRouter } from 'next/router'
import React from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

const loans = () => {
  const router = useRouter()
  return (
    <Box>
      <ShadowCardButton
        prefixIcon={<Image src="./images/svg8.svg" />}
        text="Energy Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/svg8.svg" />}
        text="Energy Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/svg8.svg" />}
        text="Energy Financing"
        textStyle="start"
        postIcon={<MdOutlineKeyboardArrowRight />}
        handleClick={() => router.push('/loans')}
        dataTest="store_button"
        sx={buttonStyles}
      />
      <ShadowCardButton
        prefixIcon={<Image src="./images/svg8.svg" />}
        text="Energy Financing"
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
