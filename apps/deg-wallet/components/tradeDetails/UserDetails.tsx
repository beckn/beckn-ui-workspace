import React from 'react'
import { Typography } from '@beckn-ui/molecules'
import { Box, Stack, StackDivider, Flex, Image, CardBody, Card } from '@chakra-ui/react'
import { testIds } from '@shared/dataTestIds'

export interface UserBlockProps {
  title?: string
  name: {
    icon: string
    text: string
  }
  mail: {
    icon: string
    text: string
  }
  mobile: {
    icon: string
    text: string
  }
  dataTest?: string
}

const UserDetails: React.FC<UserBlockProps> = ({ title, name, mail, mobile, dataTest }) => {
  return (
    <Card
      className="border_radius_all"
      margin="10px"
      boxShadow={'0px 10px 14px 0px #0000001A'}
      data-test={dataTest}
    >
      <CardBody
        padding={'20px 15px'}
        h="54px"
      >
        {title && (
          <Box marginBottom="1rem">
            <Typography
              fontSize="17px"
              fontWeight="600"
              text={title}
              color={'#000000'}
            />
          </Box>
        )}
        <Stack
          divider={<StackDivider />}
          spacing="4"
        >
          <Flex alignItems={'center'}>
            <Image
              alt="name-icon"
              src={name.icon}
              pr={'12px'}
            />
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_name}
              text={name.text}
            />
          </Flex>
          <Flex alignItems={'center'}>
            <Image
              alt="location-icon"
              src={mail.icon}
              pr={'12px'}
            />
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_address}
              text={mail.text}
            />
          </Flex>
          <Flex alignItems={'center'}>
            <Image
              alt="call-icon"
              src={mobile.icon}
              pr={'12px'}
            />
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_mobileNumber}
              text={mobile.text}
            />
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default UserDetails
