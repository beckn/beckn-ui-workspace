import { useLanguage } from '@hooks/useLanguage'
import { Box, Flex, Image, theme, useTheme } from '@chakra-ui/react'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { GeoLocationType } from '@beckn-ui/common'
import alertIcon from '@public/images/alert_icon.svg'

interface AlertModalProps {
  isOpen: boolean
  handleOnClose: () => void
  handleAlertSubmit: (addressType: GeoLocationType) => void
}

const DropOffChangeAlertModal: React.FC<AlertModalProps> = ({ isOpen, handleOnClose, handleAlertSubmit }) => {
  const { t } = useLanguage()
  const theme = useTheme()

  return (
    <BottomModal
      isOpen={isOpen}
      title={
        <Flex
          width={'18%'}
          justifyContent={'space-between'}
        >
          <Typography
            text={'Alert'}
            fontWeight="700"
            fontSize="16px"
          />
          <Image
            src={alertIcon}
            alt="alert_icon"
            height={'14px'}
            alignSelf={'center'}
          />
        </Flex>
      }
      onClose={handleOnClose}
    >
      <Box
        display={'flex'}
        alignItems="center"
        justifyContent={'space-evenly'}
        height={'100px'}
      >
        <Flex
          flexDirection={'column'}
          //   width={'64%'}
          textAlign="center"
        >
          <Typography
            text={'Are you sure you want to update the drop-off location?'}
            style={{ marginBottom: '10px' }}
          />
          <Typography
            text={'Please note: fare will be recomputed as per new drop-off location'}
            style={{ marginBottom: '10px', color: theme.colors.primary['100'] }}
          />
        </Flex>
      </Box>
      <BecknButton
        text="Ok, I Understand"
        handleClick={() => handleAlertSubmit('drop-off')}
      />
    </BottomModal>
  )
}

export default DropOffChangeAlertModal
