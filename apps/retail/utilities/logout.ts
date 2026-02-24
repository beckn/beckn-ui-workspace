import { userInfoActions } from '../store/user-slice'
import Cookies from 'js-cookie'
import { NextRouter } from 'next/router'
import { Dispatch } from '@reduxjs/toolkit'

/**
 * Comprehensive logout utility that clears all user data and caches
 * @param dispatch Redux dispatch function
 * @param router Next.js router
 */
export const logoutUser = (dispatch: Dispatch<any>, router: NextRouter) => {
  // Clear Redux state
  dispatch(userInfoActions.userLogout())

  // Clear cookies
  Cookies.remove('userInfo')
  Cookies.remove('authToken')

  // List of localStorage keys to preserve (if needed)
  const keysToPreserve = ['userPhone']
  const preservedData: Record<string, string | null> = {}

  // Save data that needs to be preserved
  keysToPreserve.forEach(key => {
    preservedData[key] = localStorage.getItem(key)
  })

  // Clear all localStorage
  localStorage.clear()

  // Restore preserved data
  Object.entries(preservedData).forEach(([key, value]) => {
    if (value) localStorage.setItem(key, value)
  })

  // Clear session storage
  sessionStorage.clear()

  // Redirect to login page
  router.push('/')
}
