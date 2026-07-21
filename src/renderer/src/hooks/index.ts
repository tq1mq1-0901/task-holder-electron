import React, { useEffect, useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    if (!stored) return initialValue
    try {
      return JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (value === undefined) return
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
