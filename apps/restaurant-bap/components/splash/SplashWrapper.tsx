import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import WelcomeSplashScreen from './WelcomeSplashScreen'
import GetStartedSplashScreen from './GetStartedSplashScreen'
import { isUserLoggedIn } from '../../constants/auth'

interface SplashWrapperProps {
  children: React.ReactNode
}

type SplashState = 'welcome' | 'getStarted' | 'none'

const SplashWrapper: React.FC<SplashWrapperProps> = ({ children }) => {
  // Initialize state - check sessionStorage immediately on client side
  const [splashState, setSplashState] = useState<SplashState>(() => {
    if (typeof window === 'undefined') {
      return 'welcome' // Show welcome on server
    }
    // On client, check if we've seen splash this session
    const hasSeenSplash = window.sessionStorage.getItem('rbap_splash_seen')
    return hasSeenSplash !== 'true' ? 'welcome' : 'none' // Show welcome if we haven't seen it
  })

  const router = useRouter()

  const handleGetStarted = () => {
    // Mark splash as seen
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('rbap_splash_seen', 'true')
    }
    setSplashState('none')

    // Navigate to login page
    router.push('/signIn')
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // If we've already seen splash, don't show it again
    const hasSeenSplash = window.sessionStorage.getItem('rbap_splash_seen')
    if (hasSeenSplash === 'true') {
      setSplashState('none')
      return
    }

    // Show welcome screen for 2 seconds, then show get started screen
    if (splashState === 'welcome') {
      const timer = setTimeout(() => {
        setSplashState('getStarted')
      }, 2000) // 2 seconds

      return () => {
        clearTimeout(timer)
      }
    }
  }, [splashState])

  // Render appropriate splash screen
  if (splashState === 'welcome') {
    return <WelcomeSplashScreen />
  }

  if (splashState === 'getStarted') {
    return <GetStartedSplashScreen onGetStarted={handleGetStarted} />
  }

  // Otherwise render children
  return <>{children}</>
}

export default SplashWrapper
