// components/map/location-picker-map.tsx
'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic import بدون SSR
const MapContent = dynamic(() => import('@/components/common/locationPickerMapContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">در حال بارگذاری نقشه...</p>
      </div>
    </div>
  ),
})

interface LocationPickerMapProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
  zoom?: number
}

export function LocationPickerMap(props: LocationPickerMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    )
  }

  return <MapContent {...props} />
}
