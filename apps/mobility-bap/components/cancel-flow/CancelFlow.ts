export interface CheckBoxInputProps {
  cancellationReason: string
  checked: boolean
  onChange: (id: string) => void
  id: number | string
}
export interface CancelBookingProps {
  cancellationReasons: {
    id: number | string
    reason: string
  }[]
}

export interface SupportModel {
  phone: string
  email: string
}
