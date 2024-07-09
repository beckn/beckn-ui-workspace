import React from 'react'
import { Typography } from '@beckn-ui/molecules'
import { CardBody, Flex, Text, Image, Card, useTheme } from '@chakra-ui/react'
import { AllOrderDeliveredProps } from '../orderDetails.types'

const AllOrderDeliveredBatch = (props: AllOrderDeliveredProps) => {
  const { t, handleOnRateUsClick } = props
  const theme = useTheme()

  return (
    <>
      <Card
        mt="20px"
        border={`1px solid ${theme.colors.primary[100]}`}
        className="border_radius_all"
        boxShadow={'0px 8px 10px -6px rgb(0 0 0 / 10%), 0px 20px 25px -5px rgb(0 0 0 / 10%)'}
      >
        <CardBody padding="15px 20px">
          <Flex
            alignItems="center"
            pb="3px"
          >
            <Image
              width="20px"
              height="20px"
              src="/images/TrackIcon.svg"
            />
            <Text
              as={Typography}
              text={t('allRequestFullfilled')}
              pl="8px"
              fontSize="17px"
              fontWeight="600"
            />
          </Flex>
          <Flex
            alignItems="center"
            fontSize="15px"
            pl="20px"
          >
            <Text
              pl="8px"
              as={Typography}
              text={t('howTodo')}
            />
            <Text
              onClick={handleOnRateUsClick}
              pl="10px"
              color="#0560FA"
              as={Typography}
              text={t('rateUs')}
            />
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}

export default AllOrderDeliveredBatch
