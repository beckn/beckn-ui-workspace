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
import VaultIcon from '@public/images/vault.svg'
import SparkIcon from '@public/images/spark_icon.svg'
import { AttestationData } from '@lib/types/becknDid'
import { useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'

export interface ItemMetaData {
  id: number
  title: string
  description?: string
  datetime?: string
  isVerified?: boolean
  image?: string
  data?: any
}

interface ItemRendererProps {
  item: ItemMetaData
  renderMode?: 'short' | 'long'
  allowDeletion?: boolean
  handleOnClick: (data: ItemMetaData) => void
  attestationsCount?: boolean
  handleDeleteItem?: (item: ItemMetaData) => void
  renderingFrom?: 'attestationDetails' | null
}

export const ORG_NAME_MAP: any = {
  'open-wallet': { name: 'Vault', icon: VaultIcon },
  'open-spark': { name: 'Spark', icon: SparkIcon }
}

const ItemRenderer = (props: ItemRendererProps) => {
  const {
    renderMode,
    item,
    handleOnClick,
    allowDeletion = true,
    attestationsCount = true,
    handleDeleteItem,
    renderingFrom
  } = props
  const [openAttestations, setOpenAttestations] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)

  // useEffect(() => {
  //   if (item?.data?.attestations?.length > 0) {
  //     setIsOpen(true)
  //   }
  // }, [item?.data?.attestations])

  const theme = useTheme()
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
      console.log(attestations)
      return attestations
        .map(attestation => {
          const regex = /\/org\/([^\/]+)\/verification_methods/
          const match = attestation.verification_method.did.match(regex)

          if (!match) return null

          const name = match[1]
          const orgData = ORG_NAME_MAP[name]

          return orgData ? { name: orgData.name, icon: orgData.icon } : null
        })
        .filter(Boolean)
    }
    return []
  }
  console.log(item.data.attestations)
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
                {item.title && (
                  <Flex
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    w={'100%'}
                  >
                    <Text
                      fontWeight={'600'}
                      fontSize={'16px'}
                      // mb={'0.7rem'}
                      noOfLines={2}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                    >
                      {item.title}
                    </Text>
                    <Box marginTop={'2px'}>
                      {item?.isVerified ? (
                        <Image
                          src={VerifiedIcon}
                          width={'80px'}
                          height={'18px'}
                        />
                      ) : (
                        <Image
                          src={UnverifiedIcon}
                          width={'80px'}
                          height={'18px'}
                        />
                      )}
                    </Box>
                  </Flex>
                )}
                {item.data.source && (
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
                      text={item.data.source}
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

              {item?.datetime && (
                <>
                  <Flex
                    flexDir={'row'}
                    justifyContent={'space-between'}
                  >
                    <Flex flexDir={'column'}>
                      <Typography
                        text={formatDate(item?.datetime!, 'do MMM yyyy, h.mma')}
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
            pb={4}
            pl="unset"
            mt="10px"
          >
            {(renderingFrom === 'attestationDetails' ? item.data.attestations : getAttestationItems())?.map(
              (attestation: any, index: number) => (
                <>
                  <Flex
                    pl="20px"
                    pr="20px"
                    key={index}
                    alignItems="center"
                    gap="5px"
                    className="accordion-attestation-border"
                    justifyContent={'space-between'}
                  >
                    <Text
                      fontSize="16px"
                      color={'#5F5F5F'}
                      fontWeight="500"
                    >
                      {attestation.name}
                    </Text>
                    {attestation?.icon && (
                      <Image
                        src={attestation?.icon}
                        alt="attestation"
                      />
                    )}
                  </Flex>
                  <Divider
                    mb="10px"
                    mt="10px"
                    ml="20px"
                    mr="20px"
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
