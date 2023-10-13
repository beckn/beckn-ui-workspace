export const getLocalStorage = (item: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return JSON.parse(localStorage.getItem(item) as string)
  } else {
    return ''
  }
}
