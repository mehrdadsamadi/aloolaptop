import { useContext } from 'react'
import { LoadingContext } from '@/context/loading.context'

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('هوک useLoading باید داخل LoadingProvider استفاده شود.')
  }
  return context
}
