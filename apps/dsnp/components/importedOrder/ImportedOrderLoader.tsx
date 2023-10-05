import { Spinner, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModal from '../BottomModal'
import Loader from '../loader/Loader'

const ImportedOrderLoader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t, locale } = useLanguage()
  return (
    <BottomModal isOpen={isOpen} onClose={onClose} modalHeader={t.importedOrder}>
      <Loader loadingText={t.Pleasewait} subLoadingText={t.loaderSubText} />
    </BottomModal>
  )
}

export default ImportedOrderLoader
