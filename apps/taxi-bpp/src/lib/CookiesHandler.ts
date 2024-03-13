export const setCookie = (key: any, value: any) => {
  const d = new Date()
  d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie = key + '=' + value + ';' + expires + ';path=/'
}

export const getCookie = (key: any) => {
  const name = key + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export const removeCookie = (name: any) => {
  // This function will attempt to remove a cookie from all paths.
  const pathBits = window.location.pathname.split('/')
  let pathCurrent = ' path='

  // do a simple pathless delete first.
  document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;'

  for (let i = 0; i < pathBits.length; i++) {
    pathCurrent += (pathCurrent.substr(-1) !== '/' ? '/' : '') + pathBits[i]
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';'
  }
}
