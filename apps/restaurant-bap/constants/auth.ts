export interface MockUser {
  id: string
  name: string
  email: string
}

// Hardcoded credentials for testing (will be replaced with API later)
export const HARDCODED_CREDENTIALS = {
  email: 'user@quickbites.com',
  password: 'password123',
  name: 'QuickBites User'
}

const STORAGE_KEY = 'rbap_mock_user'

const isBrowser = () => typeof window !== 'undefined'

// Validate hardcoded credentials
export const validateCredentials = (email: string, password: string): boolean => {
  return (
    email.toLowerCase().trim() === HARDCODED_CREDENTIALS.email.toLowerCase() &&
    password === HARDCODED_CREDENTIALS.password
  )
}

export const saveMockUserSession = (user?: MockUser) => {
  if (!isBrowser()) return

  // If user provided, use it; otherwise use default or credentials user
  const userToSave: MockUser = user || {
    id: 'mock-user-1',
    name: HARDCODED_CREDENTIALS.name,
    email: HARDCODED_CREDENTIALS.email
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userToSave))
  } catch {
    // fail silently – session is optional
  }
}

export const clearMockUserSession = () => {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore storage errors
  }
}

export const getMockUser = (): MockUser | null => {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MockUser
  } catch {
    return null
  }
}

export const isUserLoggedIn = (): boolean => {
  return !!getMockUser()
}
