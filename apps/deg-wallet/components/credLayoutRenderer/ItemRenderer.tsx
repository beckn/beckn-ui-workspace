import { formatDate } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  useTheme
} from '@chakra-ui/react'
import React, { useState } from 'react'
import VerifiedIcon from '@public/images/verified.svg'
import UnverifiedIcon from '@public/images/unverified.svg'
import DownArrow from '@public/images/down_arrow.svg'
import RetailIcon from '@public/images/spark_icon.svg'
import RentalIcon from '@public/images/rental_attest.svg'
import EVChargingIcon from '@public/images/ev_attest.svg'
import { AttestationData } from '@lib/types/becknDid'
import { useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'
import ProfileIcon from '@public/images/Profile.svg'

export interface ItemMetaData {
  id: number
  title: string
  source?: string
  description?: string
  datetime?: string
  isVerified?: boolean
  image?: string
  data?: any
  fileUrl?: string
}

interface ItemRendererProps {
  item: ItemMetaData
  renderMode?: 'short' | 'long'
  allowDeletion?: boolean
  handleOnClick: (data: ItemMetaData) => void
  attestationsCount?: boolean
  handleDeleteItem?: (item: ItemMetaData) => void
  renderingFrom?: 'attestationDetails' | null
  showVerificationStatus?: boolean
}

export const ORG_NAME_MAP: any = {
  retail: { name: 'Retail', icon: RetailIcon },
  rental: { name: 'Rental', icon: RentalIcon },
  ev_charging: { name: 'EV Charging App', icon: EVChargingIcon }
}

const ItemRenderer = (props: ItemRendererProps) => {
  const {
    renderMode,
    item,
    handleOnClick,
    allowDeletion = true,
    attestationsCount = true,
    handleDeleteItem,
    renderingFrom,
    showVerificationStatus = true
  } = props
  const [openAttestations, setOpenAttestations] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)

  // useEffect(() => {
  //   if (item?.data?.attestations?.length > 0) {
  //     setIsOpen(true)
  //   }
  // }, [item?.data?.attestations])

  const theme = useTheme()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const primaryColor = theme.colors.primary['100']

  const getNoOfMasked = (value: number) => {
    let text = 'X'
    for (let i = 1; i < value; i++) {
      text += 'X'
    }
    return text
  }

  const getAttestationItems = () => {
    if (item?.data?.attestations?.length > 0) {
      const attestations: AttestationData[] = item.data.attestations
      return attestations
        .map(attestation => {
          const regex = /\/org\/([^\/]+)\/verification_methods/

          if (attestation.verification_method.did.startsWith(user?.did!)) {
            const orgData = { name: 'Self', icon: ProfileIcon }

            return orgData ? { name: orgData.name, icon: orgData.icon } : null
          }
          if (attestation.verification_method.did.match(regex)) {
            const match = attestation.verification_method.did.match(regex)

            if (!match) return null

            const name = match[1]
            const orgData = ORG_NAME_MAP[name]

            return orgData ? { name: orgData.name, icon: orgData.icon } : null
          }
        })
        .filter(Boolean)
    }
    return []
  }

  return (
    <Box
      //   minH={'168px'}
      width={['100%', '100%', '100%', `${renderMode === 'short' ? 'calc(50% - 16px)' : '100%'}`]}
      m={['0 0 16px 0', '0 0 16px 0', '8px', '8px']}
      backgroundColor={'#fff'}
      borderRadius={'1rem'}
      display={'flex'}
      cursor="pointer"
      _hover={{
        transform: ['none', 'none', 'translate(2%,-2%)']
      }}
      transition="0.5s all"
      position={'relative'}
      boxShadow={'0px 8px 10px 0px #0000001A'}
    >
      <Accordion
        allowToggle
        index={isOpen ? [0] : []}
        width="100%"
      >
        <AccordionItem borderTopWidth={'0px !important'}>
          <Box
            display={'flex'}
            position={'relative'}
            width={'100%'}
          >
            {item?.image && (
              <Box
                w={'125px'}
                position="relative"
                borderTopLeftRadius={'1rem'}
                borderBottomLeftRadius={'1rem'}
                overflow={'hidden'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                alignItems={'center'}
                margin="0.7rem"
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  height={'100%'}
                >
                  <Image
                    src={item.image}
                    // width={'100%'}
                    // height={'100%'}
                    alt={'item_image'}
                    // boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
                    //   objectFit={'cover'}
                  />
                </Box>
              </Box>
            )}
            <Box
              p={'15px'}
              pt={'11px'}
              w={'100%'}
              position={'relative'}
              display={'flex'}
              flexDir={'column'}
              alignSelf="center"
              gap="6px"
            >
              <Box onClick={() => handleOnClick(item)}>
                <Box>
                  {item.title && (
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'flex-start'}
                      w={'100%'}
                      gap="10px"
                    >
                      <Text
                        fontWeight={'600'}
                        fontSize={'16px'}
                        // mb={'0.7rem'}
                        noOfLines={2}
                        textOverflow="ellipsis"
                        whiteSpace="pre-wrap"
                        overflowWrap="break-word"
                        width={'10rem'}
                      >
                        {item.title}
                      </Text>
                      {showVerificationStatus && (
                        <Box marginTop={'2px'}>
                          {item?.isVerified ? (
                            <Image
                              src={VerifiedIcon}
                              width={'100px'}
                              height={'22px'}
                            />
                          ) : (
                            <Image
                              src={UnverifiedIcon}
                              width={'100px'}
                              height={'22px'}
                            />
                          )}
                        </Box>
                      )}
                    </Flex>
                  )}
                  {item.source && (
                    <Flex
                      flexDir={'row'}
                      gap="2px"
                    >
                      <Typography
                        text={`Source:`}
                        fontWeight={'700'}
                        fontSize="10px"
                      />
                      <Typography
                        text={item.source}
                        fontSize="10px"
                        color="#9E9E9E"
                        style={{
                          textTransform: 'capitalize'
                        }}
                      />
                    </Flex>
                  )}

                  {item.description && (
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'flex-start'}
                      w={'100%'}
                    >
                      <Text
                        fontSize={'10px'}
                        // mb={'0.4rem'}
                        noOfLines={2}
                        textOverflow="ellipsis"
                        whiteSpace="pre-wrap"
                        overflowWrap="break-word"
                        color={'#ACACAC'}
                      >
                        {`${item.description.slice(0, 2)}${getNoOfMasked(item.description.length - 6)}${item.description.slice(-4)}`}
                      </Text>
                    </Flex>
                  )}
                </Box>
                {/* <Box height={'14px'}> */}
                {item?.data?.attachment && (
                  <Typography
                    text={item?.data?.attachment}
                    fontSize={'10px'}
                    fontWeight="600"
                    color={primaryColor}
                  />
                )}
                {/* </Box> */}
              </Box>
              {item?.datetime && (
                <>
                  <Flex
                    flexDir={'row'}
                    justifyContent={'space-between'}
                  >
                    <Flex flexDir={'column'}>
                      <Typography
                        text={formatDate(new Date(Number(item?.datetime) * 1000 || ''), 'do MMM yyyy, h.mma')}
                        fontSize={'10px'}
                        color={'#5F5F5F'}
                      />
                      {attestationsCount && item?.data?.attestations?.length > 0 && (
                        <AccordionButton
                          className="accc-btn"
                          bg="unset !important"
                          pl="unset"
                          padding={'0 0'}
                          onClick={() => setIsOpen(!isOpen)}
                          marginTop={'6px'}
                        >
                          <Flex
                            flexDir="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              text={`Attested By (${item?.data?.attestations?.length})`}
                              fontSize="10px"
                              color="#4498E8"
                            />
                            <Image
                              src={DownArrow}
                              onClick={e => {
                                e.stopPropagation() // Prevents Accordion toggle if needed
                                setOpenAttestations(true)
                                setIsOpen(!isOpen)
                              }}
                            />
                          </Flex>
                        </AccordionButton>
                      )}
                    </Flex>
                    {allowDeletion && (
                      <Box
                        alignSelf={'end'}
                        cursor="pointer"
                      >
                        <Typography
                          text={`Remove`}
                          fontSize={'10px'}
                          color={'#FF4747'}
                          onClick={() => handleDeleteItem?.(item)}
                        />
                      </Box>
                    )}
                  </Flex>
                </>
              )}
            </Box>
          </Box>
          <AccordionPanel
            pb={'0px'}
            // mt="10px"
            cursor="default"
          >
            {(renderingFrom === 'attestationDetails' ? item.data.attestations : getAttestationItems())?.map(
              (attestation: any, index: number) => (
                <>
                  <Flex
                    pl="10px"
                    pr="0px"
                    key={index}
                    alignItems="center"
                    gap="5px"
                    className="accordion-attestation-border"
                    justifyContent={'space-between'}
                    flexDirection={renderingFrom === 'attestationDetails' ? 'row-reverse' : 'inherit'}
                  >
                    <Text
                      fontSize="14px"
                      color={'#5F5F5F'}
                      fontWeight="500"
                    >
                      {attestation.name}
                    </Text>
                    {attestation?.icon && (
                      <Image
                        src={attestation?.icon}
                        alt="attestation"
                        width={renderingFrom === 'attestationDetails' ? '100px' : '20px'}
                        height={renderingFrom === 'attestationDetails' ? '22px' : '16px'}
                      />
                    )}
                  </Flex>
                  <Divider
                    mb="10px"
                    mt="10px"
                    ml="10px"
                    mr="0px"
                    w="unset"
                  />
                </>
              )
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default ItemRenderer
