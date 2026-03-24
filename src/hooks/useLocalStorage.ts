import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable — silently fail
    }
  }, [key, value])

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue(newValue)
    },
    []
  )

  return [value, setStoredValue]
}
