// localStorageUtil.js

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

// Getter function to retrieve data from localStorage
export const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    // Only try to get the localStorage item if window is defined
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : null // Convert string back to original data type
  }
  return null // Return null if window is not defined
}
