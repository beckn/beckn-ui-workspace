import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Dropdown from './Dropdown'
import styles from '../styles/Index.module.css'
import en from '../locales/en'

const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
    <nav
      className={styles.navbar}
      ref={dropdownRef}
    >
      <div className={styles.navItem}>
        <Dropdown
          label={en.navbar.applicationAdministrator}
          options={[
            {
              name: en.navbar.settings,
              handleClick: () => {
                router.push('/manageUser')
                handleToggle('')
              }
            },
            {
              name: en.navbar.signout,
              handleClick: () => {
                router.push('/signIn')
                handleToggle('')
              }
            }
          ]}
          isActive={activeDropdown === 'Application Administrator'}
          onToggle={() => handleToggle('Application Administrator')}
        />
      </div>
      <div className={styles.navItem}>
        <Dropdown
          label={en.navbar.admin}
          options={[
            {
              name: en.navbar.role,
              handleClick: () => {
                router.push('/roles')
                handleToggle('')
              }
            },
            {
              name: en.navbar.user,
              handleClick: () => {
                router.push('/users')
                handleToggle('')
              }
            },
            {
              name: en.navbar.networkParticipant,
              handleClick: () => {
                router.push('/networkParticipants')
                handleToggle('')
              }
            },
            {
              name: en.navbar.userRole,
              handleClick: () => {
                router.push('/userRoles')
                handleToggle('')
              }
            }
          ]}
          isActive={activeDropdown === 'Admin'}
          onToggle={() => handleToggle('Admin')}
        />
      </div>
      <div className={styles.navItem}>
        <Dropdown
          label={en.navbar.beckn}
          options={[
            {
              name: en.navbar.networkDomain,
              handleClick: () => {
                router.push('/networkDomains')
                handleToggle('')
              }
            }
          ]}
          isActive={activeDropdown === 'Beckn'}
          onToggle={() => handleToggle('Beckn')}
        />
      </div>
    </nav>
  )
}

export default Navbar
