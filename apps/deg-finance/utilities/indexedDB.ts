const DB_NAME = 'openspark_cache'
const STORE_NAME = 'search_results'
const DB_VERSION = 1

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' })
      }
    }
  })
}

export const setInCache = (cacheKey: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)

      const cacheData = {
        cacheKey,
        data,
        timestamp: new Date().getTime()
      }

      store.put(cacheData)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    }
  })
}

export const getFromCache = (cacheKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const getRequest = store.get(cacheKey)

      getRequest.onsuccess = () => {
        const result = getRequest.result
        if (!result) {
          resolve(null)
          return
        }

        if (new Date().getTime() - result.timestamp > 5 * 60 * 1000) {
          // Remove expired cache
          const deleteTx = db.transaction(STORE_NAME, 'readwrite')
          const deleteStore = deleteTx.objectStore(STORE_NAME)
          deleteStore.delete(cacheKey)
          resolve(null)
          return
        }

        resolve(result.data)
      }
      getRequest.onerror = () => reject(getRequest.error)
    }
  })
}

export const clearCache = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    }
  })
}
