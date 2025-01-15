import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import navIcon from '@public/images/nav_icon.svg'

interface NavigationItemProps {
  key?: string
  icon: string
  label: string
  arrow?: boolean
  divider?: boolean
  color?: string
  handleClick?: () => void
}

const NavigationItem = (props: NavigationItemProps) => {
  const { key, icon, label, divider = true, arrow = true, color, handleClick } = props
  return (
    <>
      <Flex
        justifyContent="space-between"
        padding={'1.5rem 0'}
        cursor="pointer"
        onClick={handleClick}
      >
        <Flex gap={'1rem'}>
          <Image
            src={icon}
            alt="nav_icon"
          />
          <Typography
            fontSize="16px"
            sx={{
              textWrap: 'noWrap'
            }}
            text={label}
            color={color}
            dataTest={label}
          />
        </Flex>
        {arrow && (
          <Image
            src={navIcon}
            alt="nav_arrow"
          />
        )}
      </Flex>
      {divider && <Divider />}
    </>
  )
}

export default NavigationItem
