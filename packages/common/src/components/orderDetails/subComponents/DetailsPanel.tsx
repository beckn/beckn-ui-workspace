import React from 'react'
import { Accordion, Typography } from '@beckn-ui/molecules'
import { Box, Stack, StackDivider, Flex, Image } from '@chakra-ui/react'
import { DetailsPanelProps } from '../orderDetails.types'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'

const DetailsPanel: React.FC<DetailsPanelProps> = ({ title, name, address, mobile, responsive }) => {
  const { isDesktop } = useResponsive()

  const renderDetailsPanel = () => {
    return (
      <Box>
        {isDesktop && (
          <Box marginBottom="1rem">
            <Typography
              variant="subTitleRegular"
              fontSize="17px"
              text={title}
            />
          </Box>
        )}
        <Box
          pl={'14px'}
          pr={'11px'}
          pb={'11px'}
          pt={'6px'}
          boxShadow={{
            base: '0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
            md: '0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 8px 20px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
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
                text={name.text}
              />
            </Flex>
            <Flex alignItems={'center'}>
              <Image
                alt="location-icon"
                src={address.icon}
                pr={'12px'}
              />
              <Typography
                variant="subTitleRegular"
                text={address.text}
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
                text={mobile.text}
              />
            </Flex>
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <>
      {isDesktop && renderDetailsPanel()}
      {!isDesktop && <Accordion accordionHeader={title}>{renderDetailsPanel()}</Accordion>}
    </>
  )
}

export default DetailsPanel
