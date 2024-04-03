import React from 'react'
import { Divider, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { CloseIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const HeaderContent = ({ text }: { text: string }) => {
  const router = useRouter()
  return (
    <>
      <Flex
        justifyContent={'space-between'}
        mt={'10px'}
        mb={'15px'}
      >
        <Typography
          text={text}
          fontWeight="700"
          fontSize="14px"
        />
        <CloseIcon
          as="button"
          onClick={() => router.back()}
        />
      </Flex>
      <Divider
        mb={'20px'}
        w={'unset'}
        mr="-20px"
        ml="-20px"
        borderBottomWidth={'2px'}
      />
    </>
  )
}

export default HeaderContent
