import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Image } from '@chakra-ui/react'
import React, { useState } from 'react'
import Styles from './CustomDrawer.module.css'
import hamburgerIcon from '@public/images/hamburger.svg'

interface CustomDrawer {
  isOpen: boolean
  children: React.ReactNode
  handleDrawerToggle: () => void
}

const optionMenu = [{ id: 'home', label: 'Home' }]

const CustomDrawer = (props: CustomDrawer) => {
  const { isOpen, children, handleDrawerToggle } = props
  const [selected, setSelected] = useState<string>('0')

  return (
    <>
      {isOpen && (
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

      <Box className={`${Styles.drawer} ${isOpen ? Styles.open : Styles.close}`}>{children}</Box>
    </>
  )
}

export default CustomDrawer
