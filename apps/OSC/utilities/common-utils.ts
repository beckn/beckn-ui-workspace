export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'))
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    }
  })
}
