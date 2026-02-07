import { useEffect, useState } from 'react'

export const isClient = typeof window !== 'undefined'

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
