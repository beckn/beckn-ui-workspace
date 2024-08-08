import React, { useState } from 'react'
import { Box, Flex, Text, useTheme, useDisclosure } from '@chakra-ui/react'
import { PlusSquareIcon, AttachmentIcon } from '@chakra-ui/icons'
import { Typography, BottomModal } from '@beckn-ui/molecules'
import { DetailCard } from '@beckn-ui/becknified-components'
import DyForm from './DyForm'
import { useLanguage } from '@hooks/useLanguage'

interface AddSectionProps {
  htmlString: string
  form_id: string
  sectionSubTitle?: string
  preSubmissionTitle?: string
  postSubmissionTitle?: string
  isFormSubmit: boolean
  disabled?: boolean
  modalTitle?: string
  notifySubmit: (submitted: boolean) => void
  bottomGap?: string
  dataTest: string
}

const AddSection: React.FC<AddSectionProps> = ({
  htmlString,
  form_id,
  sectionSubTitle,
  preSubmissionTitle = 'Add Dispute Details',
  postSubmissionTitle = 'Dispute Details added',
  isFormSubmit = false,
  disabled = false,
  modalTitle,
  notifySubmit,
  bottomGap = '30',
  dataTest
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useLanguage()
  const theme = useTheme()
  const bgColorOfPrimary = theme.colors.primary['100']

  const onSubmit = (submitted: boolean) => {
    notifySubmit(submitted)
    onClose()
  }

  const onError = () => {
    onClose()
  }

  return (
    <Box>
      <Flex
        pb={'10px'}
        mt={'20px'}
        justifyContent={'space-between'}
      >
        <Text fontSize={'17px'}>{sectionSubTitle}</Text>
      </Flex>
      <DetailCard isDisabled={disabled}>
        {!isFormSubmit ? (
          <Flex
            alignItems={'center'}
            onClick={() => !disabled && onOpen()}
            data-test={dataTest}
          >
            <PlusSquareIcon color={bgColorOfPrimary} />
            <Typography
              variant="subTitleRegular"
              text={preSubmissionTitle}
              color={bgColorOfPrimary}
              style={{ paddingLeft: '10px' }}
            />
          </Flex>
        ) : (
          <Flex alignItems={'center'}>
            <AttachmentIcon />
            <Typography
              variant="subTitleRegular"
              text={postSubmissionTitle}
              style={{ paddingLeft: '10px' }}
            />
          </Flex>
        )}
        {!disabled && (
          <BottomModal
            title={modalTitle}
            isOpen={isOpen}
            onClose={onClose}
            responsiveBottomGap={bottomGap}
          >
            <DyForm
              htmlForm={htmlString}
              onSubmit={onSubmit}
              onError={onError}
              formId={form_id}
              handleCancel={onClose}
            />
          </BottomModal>
        )}
      </DetailCard>
    </Box>
  )
}

export default AddSection
