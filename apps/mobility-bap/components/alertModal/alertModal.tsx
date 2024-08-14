import { useLanguage } from '@hooks/useLanguage'
import { Box, Flex, Image } from '@chakra-ui/react'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

interface AlertModalProps {
  isOpen: boolean
  name: string
  handleOnClose: () => void
  handleOpenPolicy: () => void
  handleAlertSubmit: () => void
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  name,
  handleOnClose,
  handleOpenPolicy,
  handleAlertSubmit
}) => {
  const { t } = useLanguage()
  return (
    <BottomModal
      isOpen={isOpen}
      title={'Alert'}
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
            text={'This Area has extremely high traffic, Recommend alternate modes of transport.'}
            style={{ marginBottom: '10px' }}
          />
          <Typography
            text={'To know more, read the details at :'}
            style={{ marginBottom: '10px' }}
          />
          <Typography
            text={name}
            onClick={handleOpenPolicy}
            style={{ marginBottom: '10px', color: '#0000FF' }}
          />
        </Flex>
      </Box>
      <BecknButton
        text="Ok, I Understand"
        handleClick={handleAlertSubmit}
      />
    </BottomModal>
  )
}

export default AlertModal
