import { useState, useEffect } from 'react'

type ValueSetter<T> = (value: T | ((prevValue: T) => T)) => void

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, ValueSetter<T>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error retrieving localStorage item ${key}:`, error)
            return initialValue
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (error) {
            console.error(`Error setting localStorage item ${key}:`, error)
        }
    }, [key, storedValue])

    return [storedValue, setStoredValue]
}
