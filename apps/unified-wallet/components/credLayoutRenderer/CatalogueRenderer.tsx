import { formatDate } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import VerifiedIcon from '@public/images/verified.svg'
import UnverifiedIcon from '@public/images/unverified.svg'

export interface ItemMetaData {
  id: number
  title: string
  description?: string
  datetime?: string
  isVerified?: boolean
  image?: string
}

interface CatalogueRendererProps {
  list: ItemMetaData[]
  renderMode?: 'short' | 'long'
}

const CatalogueRenderer = (props: CatalogueRendererProps) => {
  const { list, renderMode = 'long' } = props
  return (
    <>
      {list.map(item => {
        return (
          <>
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
              <Box
                display={'flex'}
                position={'relative'}
                width={'100%'}
              >
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
                      width={'100%'}
                      height={'100%'}
                      alt={'item_image'}
                      boxShadow={'0 20px 25px rgba(0, 0, 0, 0.1),0 8px 10px rgba(0, 0, 0, 0.05)'}
                      //   objectFit={'cover'}
                    />
                  </Box>
                </Box>
                <Box
                  p={'15px'}
                  pt={'11px'}
                  w={'100%'}
                  position={'relative'}
                  display={'flex'}
                  flexDir={'column'}
                >
                  {item.title && (
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'flex-start'}
                      w={'100%'}
                    >
                      <Text
                        fontWeight={'600'}
                        fontSize={'16px'}
                        mb={'0.7rem'}
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

                  <Flex
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    w={'100%'}
                  >
                    <Text
                      fontSize={'10px'}
                      mb={'0.4rem'}
                      noOfLines={2}
                      textOverflow="ellipsis"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      color={'#5F5F5F'}
                    >
                      {item.description}
                    </Text>
                  </Flex>

                  <Typography
                    text={formatDate(item?.datetime!, 'do MMM yyyy, h.mma')}
                    fontSize={'10px'}
                    color={'#5F5F5F'}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )
      })}
    </>
  )
}

export default CatalogueRenderer
