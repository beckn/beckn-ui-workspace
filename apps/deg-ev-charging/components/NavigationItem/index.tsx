import { Typography } from '@beckn-ui/molecules'
import { Flex, Image, useTheme } from '@chakra-ui/react'
import React from 'react'

interface NavigationItemProps {
  icon: string
  label: string
  color?: string
  handleClick?: () => void
  dataTest?: string
}

const NavigationItem = (props: NavigationItemProps) => {
  const { icon, label, color, handleClick, dataTest } = props

  const theme = useTheme()
  const primaryColor = theme.colors.primary[100]

  return (
    <>
      <Flex
        justifyContent="space-between"
        padding={'0.5rem 1rem'}
        cursor="pointer"
        onClick={handleClick}
        style={{
          border: `1px solid ${primaryColor}`,
          borderRadius: '8px'
        }}
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
      </Flex>
    </>
  )
}

export default NavigationItem
