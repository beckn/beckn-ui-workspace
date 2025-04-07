import React, { useState } from 'react'
import { Box, Flex, Image, Text, Card, CardBody } from '@chakra-ui/react'
import pdfIcon from '../../public/images/PDFBLACK.svg'
import verifiedIcon from '../../public/images/verified.svg'
import { ROLE } from '@lib/config'

interface Credential {
  name: string
  type: string
  verifiedAt: string
  isVerified: boolean
}

interface UserCredentialsProps {
  userCredentials: Credential[]
}

const UserCredentials: React.FC<UserCredentialsProps> = ({ userCredentials }) => {
  const [role, setRole] = useState<ROLE>(ROLE.BUY)
  const roleName = role === ROLE.BUY ? 'Producer' : 'Consumer'

  return (
    <Card
      className="border_radius_all"
      margin="10px"
      boxShadow={'0px 10px 14px 0px #0000001A'}
    >
      <CardBody
        padding={'20px 15px'}
        h="54px"
      >
        <Text
          fontSize="17px"
          fontWeight="600"
          color={'#000000'}
          mb={2}
        >
          {`${roleName} Credentials`}
        </Text>
        {userCredentials.map(
          (credential, index) =>
            credential.isVerified && (
              <Box
                key={index}
                mb={4}
                border="1px solid #E0E0E0"
                borderRadius="12px"
                padding="12px"
                backgroundColor="white"
                boxShadow="sm"
              >
                <Flex
                  alignItems="center"
                  gap={3}
                >
                  {/* PDF Icon */}
                  <Image
                    src={pdfIcon}
                    alt="PDF Icon"
                    width="40px"
                    height="50px"
                  />

                  <Box flex="1">
                    <Flex
                      alignItems="center"
                      gap={2}
                    >
                      <Text
                        fontSize="12px"
                        fontWeight="600"
                      >
                        {credential.name}
                      </Text>
                      <Image
                        src={verifiedIcon}
                        alt="Verified Icon"
                        width="74px"
                        height="20px"
                      />
                    </Flex>

                    <Text
                      fontSize="12px"
                      fontWeight="400"
                      color="gray.600"
                      mt={1}
                    >
                      {credential.verifiedAt}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )
        )}
      </CardBody>
    </Card>
  )
}

export default UserCredentials
