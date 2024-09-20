import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Image, useMediaQuery } from '@chakra-ui/react'
import React, { useState } from 'react'
import Styles from './customDrawer.module.css'
import hamburgerIcon from '@public/images/hamburger.svg'
import { useRouter } from 'next/router'

interface CustomDrawer {
  isOpen: boolean
  children: React.ReactNode
  handleDrawerToggle: () => void
}

const optionMenu = [{ id: 'home', label: 'Home' }]

const CustomDrawer = (props: CustomDrawer) => {
  const { isOpen, children, handleDrawerToggle } = props
  const [selected, setSelected] = useState<string>('0')

  const [isLargerThan1525] = useMediaQuery('(min-width: 1525px)')

  const router = useRouter()

  return (
    <>
      {(isOpen || isLargerThan1525) && (
        <>
          <Box className={Styles.drawer_overlay}>
            <Typography
              color="#fff"
              fontWeight="600"
              style={{
                lineHeight: '1.5',
                letterSpacing: '0.00938em',
                textAlign: 'left',
                fontSize: '18px',
                fontWeight: '600',
                padding: '20px',
                borderWidth: '0',
                borderStyle: 'solid',
                borderColor: 'rgba(0, 0, 0, 0.12)',
                borderBottomWidth: 'thin'
              }}
              text="Network Information Services"
            />
            <Image
              width={'16px'}
              cursor="pointer"
              className={Styles.sideNavIcon}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '1rem',
                width: '18px'
              }}
              src={hamburgerIcon}
              onClick={handleDrawerToggle}
            />
            {optionMenu.map(option => {
              return (
                <Box
                  key={option.id}
                  className={`${Styles.drawer_option} ${selected ? Styles.selected : ''}`}
                  onClick={() => {
                    console.log('called onClick', option.id)
                    setSelected(option.id)
                    router.push('/')
                  }}
                >
                  <Typography
                    color="#333"
                    style={{
                      letterSpacing: '0.00938em',
                      textAlign: 'left',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#fff',
                      width: 'fit-content',
                      marginLeft: '1rem'
                    }}
                    text={option.label}
                  />
                </Box>
              )
            })}
          </Box>
        </>
      )}

      <Box className={`${Styles.drawer} ${isOpen || isLargerThan1525 ? Styles.open : Styles.close}`}>
        <Box className={`${isOpen && `${Styles.container_drawer} header-section-handle`}`}>{children}</Box>
      </Box>
    </>
  )
}

export default CustomDrawer
