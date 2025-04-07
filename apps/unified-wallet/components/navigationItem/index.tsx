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
  dataTest?: string
  renderType?: 'card' | 'plain'
}

const NavigationItem = (props: NavigationItemProps) => {
  const { key, icon, label, divider = true, arrow = true, color, handleClick, dataTest, renderType = 'plain' } = props
  return (
    <>
      <Flex
        justifyContent="space-between"
        padding={'1.5rem 0'}
        cursor="pointer"
        onClick={handleClick}
        style={
          renderType === 'card'
            ? {
                boxShadow: 'rgba(0, 0, 0, 0.1) 2px 14px 40px 4px',
                padding: '1.5rem 1.5rem',
                borderRadius: '12px'
              }
            : {}
        }
      >
        <Flex
          gap={'1rem'}
          alignItems="center"
        >
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
            dataTest={dataTest}
          />
        </Flex>
        {arrow && (
          <Image
            w={'8px'}
            src={navIcon}
            alt="nav_arrow"
          />
        )}
      </Flex>
      {renderType !== 'card' && divider && <Divider />}
    </>
  )
}

export default NavigationItem
