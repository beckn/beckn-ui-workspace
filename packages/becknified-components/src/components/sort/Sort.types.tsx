import { ChangeEvent } from 'react'

export interface SortComponentProps {
  selectedBtn: string
  onChangeSelectedBtn: (e: ChangeEvent<HTMLInputElement>) => void
}
