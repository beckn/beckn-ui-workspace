import { ReactElement, ReactNode } from 'react'

export interface AccordionDetailCardProps {
  schema: {
    accordion: {
      accordionHeader?: string | ReactElement
      onToggle?: (expandedIndex: number | number[]) => void
      className?: string
    }
    dataSource?: {
      source: Record<string, any>
      className?: string
    }
  }
  children?: ReactNode
}
