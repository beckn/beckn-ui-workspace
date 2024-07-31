import { ButtonProps } from '@beckn-ui/molecules'

export interface RideSummaryHeaderProps {
  driverImg?: string
  title?: string
  subTitle?: string
}
export interface RideSummaryProps {
  time: string
  distance: string
  source: string
  destination?: string
  buttons: ButtonProps[]
}
