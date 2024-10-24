import { useLanguage } from '../../../hooks/useLanguage'
import { Box, Flex, Image } from '@chakra-ui/react'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import React from 'react'
import { testIds } from '@shared/dataTestIds'

interface OfflineModalProps {
  isOpen: boolean
}

const OfflineModal: React.FC<OfflineModalProps> = ({ isOpen }) => {
  const { t } = useLanguage()
  return (
    <BottomModal
      isOpen={isOpen}
      onClose={() => {}}
      divider="DASHED"
      backgroundAccessControl={true}
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
          data-test={testIds.taxi_BPP_offlineMode_image}
        />
        <Flex
          flexDirection={'column'}
          width={'64%'}
        >
          <Typography
            text={t.offlineTitle}
            fontWeight="500"
            fontSize={'20px'}
            data-test={testIds.taxi_BPP_offlineMode_offlineTitle}
          />
          <Typography
            text={t.offlineDescription}
            data-test={testIds.taxi_BPP_offlineMode_offlineDescription}
          />
        </Flex>
      </Box>
    </BottomModal>
  )
}

export default OfflineModal
