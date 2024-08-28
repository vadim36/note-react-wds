import { useEffect, useState } from "react";

export function useLocalStorage<DataType>(
  key: string, 
  data: DataType | (() => DataType)
): [DataType, typeof setValue] {
  const [value, setValue] = useState<DataType>(() => {
    const jsonData = localStorage.getItem(key)
    if (jsonData === null) {
      if (typeof data === 'function') {
        return (data as () => DataType)()
      }
      
      return data
    }

    return JSON.parse(jsonData)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] as [DataType, typeof setValue]
}