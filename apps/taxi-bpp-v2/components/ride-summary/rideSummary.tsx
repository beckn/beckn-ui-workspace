import { Button, Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { RideSummaryProps } from './rideSummaryType'
import Styles from '@beckn-ui/becknified-components/src/pages/auth/auth.module.css'

const RideSummary: React.FC<RideSummaryProps> = ({ time, distance, source, destination, buttons }) => {
  return (
    <Box mt="10px">
      <Flex
        mb={'16px'}
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography
            style={{ paddingRight: '15px' }}
            text={time}
          />
          <Box
            w="6px"
            h="6px"
            borderRadius={'50%'}
            bg="#DBDBDB"
            mr="10px"
          ></Box>
          <Typography text={distance} />
        </Flex>
        <Flex
          bg={'#ABD4FA'}
          p="2px 6px"
          borderRadius={'6px'}
        >
          <Image
            src="/images/near_me.svg"
            alt="near_me"
            mr="5px"
          />
          <Typography text="Navigate" />
        </Flex>
      </Flex>
      <Flex
        mb={destination ? '16px' : '30px'}
        alignItems="center"
      >
        <Image
          src="/images/pickUpIcon.svg"
          alt="pickUpIcon"
          mr="10px"
        />
        <Typography text={source} />
      </Flex>
      {destination && (
        <Flex
          mb={'30px'}
          alignItems="center"
        >
          <Image
            src="/images/destinationIcon.svg"
            alt="destinationIcon"
            mr="10px"
          />
          <Typography text={destination} />
        </Flex>
      )}
      {buttons.map(singleButton => {
        return (
          <Button
            className={Styles.auth_btn}
            key={singleButton.text}
            {...singleButton}
          />
        )
      })}
    </Box>
  )
}

export default RideSummary
