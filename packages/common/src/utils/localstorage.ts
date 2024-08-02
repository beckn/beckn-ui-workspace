// Setter function to save data to localStorage
export const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    // Only try to set the localStorage item if window is defined
    const valueToStore = JSON.stringify(value) // Convert value to a string
    window.localStorage.setItem(key, valueToStore)
  }
}

export const addLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    // Only try to set the localStorage item if window is defined
    const currentList = window.localStorage.getItem(key)
    let newList = []
    if (!currentList) {
      newList.push(value)
    } else {
      newList = [...JSON.parse(currentList), value]
    }
    const valueToStore = JSON.stringify(newList) // Convert value to a string
    window.localStorage.setItem(key, valueToStore)
  }
}

export const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined') {
    try {
      const item = window.localStorage.getItem(key)
      console.log('Stored item:', item)

      if (item) {
        try {
          return JSON.parse(item)
        } catch (parseError) {
          console.error('Error parsing JSON from localStorage:', parseError)
          return null
        }
      }
      return null
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  }
  return null
}
