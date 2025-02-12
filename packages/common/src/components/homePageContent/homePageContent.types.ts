import React from 'react'
import { Logos } from '../../../lib/types'

export interface CardType {
  id: number
  type: 'course' | 'scholarship' | 'jobs'
  image: {
    white: string
    black: string
  }
  text: string
}
export type BlockName =
  | 'header'
  | 'appLogo'
  | 'description'
  | 'selectInput'
  | 'searchInput'
  | 'searchByLocation'
  | 'geoLocationInput'
  | 'cardType'
  | 'customComponent'
  | 'footerProps'
export interface HomePageContentProps {
  blockOrder?: BlockName[]
  logos?: Logos
  headerProps?: {
    name: string
    title?: string
    description: string
    logoSrc?: string
    altText?: string
  }
  searchProps?: {
    searchPlaceholder: string
    label?: string
    setSearchTerm: (value: string) => void
    onSearchIconClick: (e: React.MouseEvent) => void
    onSearchInputEnterPress: () => void
  }
  CardSelector?: {
    imageCardList: CardType[]
    handleClick: (type: string) => void
    activeCard: string
  }
  selectInputProps?: {
    items: string[]
    selectedItem: string
    isOpen: boolean
    toggleDropdown: () => void
    handleItemClick: (item: string) => void
  }
  searchByLocation?: {
    label: string
    onSearchByLocationClick: (e: React.MouseEvent) => void
  }
  geoLocationInput?: {
    placeholder: string
    geoLocationSearchPageSelectedAddress: string
    navigateToSearchResult: () => void
  }
  customComponent?: React.ReactElement<any, any> | null
  footerProps: {
    poweredByLogoSrc: string
    poweredByText: string
  }
  showFooter?: boolean
}
