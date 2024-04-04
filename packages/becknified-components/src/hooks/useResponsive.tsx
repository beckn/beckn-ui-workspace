import React from 'react'
import { useBreakpoint } from '@chakra-ui/react'

export default function useResponsive() {
  const breakpoint = useBreakpoint()
  console.log('Dank breakpoint', breakpoint)
  const isDesktop = breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === '2xl'
  const isTablet = breakpoint === 'md'
  const isMobile = breakpoint === 'sm' || breakpoint === 'xs'

  return {
    isDesktop,
    isTablet,
    isMobile
  }
}
