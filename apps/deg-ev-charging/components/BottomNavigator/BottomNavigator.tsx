import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import HomeNavIcon from '@public/images/home_nav_icon.svg'
import SelectHomeNavIcon from '@public/images/select_home_nav_icon.svg'
import ChargerNavIcon from '@public/images/chargers_nav_icon.svg'
import SelectChargerNavIcon from '@public/images/select_chargers_nav_icon.svg'
import ProfileNavIcon from '@public/images/profile_nav_icon.svg'
import SelectProfileNavIcon from '@public/images/select_profile_nav_icon.svg'

const BottomNavigator = () => {
  const router = useRouter()
  const [selectedRoute, setSelectedRoute] = useState('/')

  useEffect(() => {
    const storedRoute = localStorage.getItem('selectedRoute')
    if (storedRoute) {
      setSelectedRoute(storedRoute)
      if (router.pathname !== storedRoute) {
        router.push(storedRoute)
      }
    }
  }, [])

  const handleNavigation = (path: string) => {
    setSelectedRoute(path)
    localStorage.setItem('selectedRoute', path)
    router.push(path)
  }

  const navItems = [
    {
      label: 'Home',
      icon: selectedRoute === '/' ? SelectHomeNavIcon : HomeNavIcon,
      path: '/',
      color: selectedRoute === '/' ? 'var(--ev-primary)' : undefined
    },
    {
      label: 'Chargers',
      icon: selectedRoute === '/orderHistory' ? SelectChargerNavIcon : ChargerNavIcon,
      path: '/orderHistory',
      color: selectedRoute === '/orderHistory' ? 'var(--ev-primary)' : undefined
    },
    {
      label: 'Profile',
      icon: selectedRoute === '/profile' ? SelectProfileNavIcon : ProfileNavIcon,
      path: '/profile',
      color: selectedRoute === '/profile' ? 'var(--ev-primary)' : undefined
    }
  ]

  return (
    <div
      className="ev-app fixed bottom-0 left-0 right-0 z-40 bg-[var(--ev-surface)] border-t border-[var(--ev-border)] shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
      style={{
        paddingLeft: 'var(--ev-safe-left)',
        paddingRight: 'var(--ev-safe-right)',
        paddingBottom: 'calc(0.75rem + var(--ev-safe-bottom))'
      }}
    >
      <div className="flex justify-around items-stretch">
        {navItems.map(item => (
          <button
            type="button"
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center cursor-pointer min-h-[44px] min-w-[64px] flex-1 py-2.5 px-2.5 rounded-lg active:bg-[var(--ev-bg)] transition-colors"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={25}
              height={25}
              className="mb-0.5"
            />
            <span
              className="text-xs font-medium"
              style={{ color: item.color ?? 'var(--ev-text-muted)' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigator
