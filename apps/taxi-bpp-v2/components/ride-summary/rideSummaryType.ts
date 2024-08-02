import { ButtonProps } from '@beckn-ui/molecules'

export interface RideSummaryHeaderProps {
  driverImg?: string
  title?: string
  subTitle?: string
}
export interface RideSummaryProps {
  time: string
  date?: string
  handleNavigate?: React.MouseEventHandler<HTMLDivElement>
  distance: string
  source: string
  destination?: string
  buttons: ButtonProps[]
  fare?: {
    text: string
    cost: string
  }
}
