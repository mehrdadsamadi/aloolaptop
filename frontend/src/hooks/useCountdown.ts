import { useEffect, useState } from 'react'

export function useCountdown(start: number, active: boolean) {
  const [timer, setTimer] = useState(start)

  useEffect(() => {
    if (!active || timer === 0) return
    const interval = setInterval(() => setTimer((p) => p - 1), 1000)
    return () => clearInterval(interval)
  }, [active, timer])

  const reset = () => setTimer(start)

  return { timer, reset }
}
