'use client'

import { useLoading } from '@/hooks/useLoading'

export default function LoadingOverlay() {
  const { isLoading } = useLoading()

  // if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-violet-800 w-screen h-screen">
      hello {isLoading}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  )
}
