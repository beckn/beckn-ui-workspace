import { useLanguage } from '../../../hooks/useLanguage'
import { Box, Flex, Image } from '@chakra-ui/react'
import { BottomModal, Typography } from '@beckn-ui/molecules'

interface OfflineModalProps {
  isOpen: boolean
}

const OfflineModal: React.FC<OfflineModalProps> = ({ isOpen }) => {
  const { t } = useLanguage()
  return (
    <BottomModal
      isOpen={isOpen}
      onClose={() => {}}
      overlay={false}
      divider="DASHED"
    >
      <Box
        display={'flex'}
        alignItems="center"
        justifyContent={'space-evenly'}
        height={'100px'}
      >
        <Image
          src={'./images/offline.svg'}
          alt={'offline icon'}
        />
        <Flex
          flexDirection={'column'}
          width={'64%'}
        >
          <Typography
            text={t.offlineTitle}
            fontWeight="500"
            fontSize={'20px'}
          />
          <Typography text={t.offlineDescription} />
        </Flex>
      </Box>
    </BottomModal>
  )
}

export default OfflineModal
