import React, { useState } from 'react'
import { Box, Flex, Text, useTheme, useDisclosure } from '@chakra-ui/react'
import { PlusSquareIcon, AttachmentIcon } from '@chakra-ui/icons'
import { Typography, BottomModal } from '@beckn-ui/molecules'
import { DetailCard } from '@beckn-ui/becknified-components'
import Styles from './AddSection.module.css'
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
  notifySubmit: (submitted: boolean) => void
}

const AddSection: React.FC<AddSectionProps> = ({
  htmlString,
  form_id,
  sectionSubTitle,
  preSubmissionTitle = 'Add Dispute Details',
  postSubmissionTitle = 'Dispute Details added',
  isFormSubmit = false,
  disabled = false,
  notifySubmit
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
      <DetailCard className={disabled ? Styles.disabled : Styles.enabled}>
        {!isFormSubmit ? (
          <Flex
            alignItems={'center'}
            onClick={() => !disabled && onOpen()}
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
            isOpen={isOpen}
            onClose={onClose}
          >
            <DyForm
              htmlForm={htmlString}
              onSubmit={onSubmit}
              onError={onError}
              formId={form_id}
            />
          </BottomModal>
        )}
      </DetailCard>
    </Box>
  )
}

export default AddSection
