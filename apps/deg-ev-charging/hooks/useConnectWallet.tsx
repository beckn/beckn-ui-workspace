import { useState, useCallback } from 'react'

type ModalType = 'wallet' | 'link' | 'otp' | 'alert' | null

interface UseConnectWalletReturn {
  modalType: ModalType
  handleModalOpen: (type: ModalType) => void
  handleModalClose: () => void
}

export const useConnectWallet = (): UseConnectWalletReturn => {
  const [modalType, setModalType] = useState<ModalType>(null)

  const handleModalOpen = useCallback((type: ModalType) => {
    setModalType(type)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalType(null)
  }, [])

  return {
    modalType,
    handleModalOpen,
    handleModalClose
  }
}
