export interface OrderCancellationModalProps {
  isOpen: boolean
  onClose: () => void
  isLoadingForCancel: boolean
  radioValue: string
  isProceedDisabled: boolean
  t: (key: string) => string
  handleOnRadioBtnChange: (value: string) => void
  handleOnProceedClick: () => void
}
