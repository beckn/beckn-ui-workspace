export const getLocalStorage = (item: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return JSON.parse(localStorage.getItem(item) as string)
  } else {
    return ''
  }
}

export const setLocalStorage = (key: string, item: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(item))
  }
}
