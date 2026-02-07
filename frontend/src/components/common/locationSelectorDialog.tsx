// components/map/location-selector-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { LocateFixed, MapPin, Navigation } from 'lucide-react'
import { toast } from 'sonner'
import { LocationPickerMap } from '@/components/common/locationPickerMap'

interface LocationSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialLatitude?: number
  initialLongitude?: number
  onLocationSelect: (lat: number, lng: number) => void
}

export function LocationSelectorDialog({
  open,
  onOpenChange,
  initialLatitude = 35.6892,
  initialLongitude = 51.389,
  onLocationSelect,
}: LocationSelectorDialogProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: initialLatitude,
    lng: initialLongitude,
  })
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(13)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (open && isClient) {
      setSelectedLocation({
        lat: initialLatitude,
        lng: initialLongitude,
      })
    }
  }, [open, initialLatitude, initialLongitude, isClient])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setZoomLevel(16)
  }

  const handleGetCurrentLocation = () => {
    if (!isClient || !navigator.geolocation) {
      toast.error('مرورگر شما از موقعیت جغرافیایی پشتیبانی نمی‌کند')
      return
    }

    setIsGettingLocation(true)
    toast.info('در حال دریافت موقعیت شما...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setSelectedLocation({ lat, lng })
        setZoomLevel(16)
        setIsGettingLocation(false)

        toast.success('موقعیت شما دریافت شد')
      },
      (error) => {
        setIsGettingLocation(false)

        let errorMessage = 'خطا در دریافت موقعیت'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'دسترسی به موقعیت جغرافیایی رد شد. لطفاً در تنظیمات مرورگر اجازه دهید.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'اطلاعات موقعیت در دسترس نیست'
            break
          case error.TIMEOUT:
            errorMessage = 'دریافت موقعیت زمان‌بر شد'
            break
        }

        toast.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleSubmit = () => {
    onLocationSelect(selectedLocation.lat, selectedLocation.lng)
    onOpenChange(false)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 1))
  }

  if (!isClient) {
    return null
  }

  return (
    <Dialog
      title="انتخاب موقعیت روی نقشه"
      description="موقعیت دقیق خود را روی نقشه انتخاب کنید"
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            انصراف
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
          >
            تأیید موقعیت
          </Button>
        </>
      }
    >
      <div className="space-y-4 overflow-y-auto max-h-100">
        <LocationPickerMap
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lng}
          onLocationChange={handleMapClick}
          zoom={zoomLevel}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            type="button"
            variant="default"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            <Navigation className="h-4 w-4 ml-2" />
            {isGettingLocation ? 'در حال دریافت...' : 'موقعیت تقریبی من'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedLocation({
                lat: 35.6892,
                lng: 51.389,
              })
              setZoomLevel(13)
            }}
            className="w-full"
          >
            <LocateFixed className="h-4 w-4 ml-2" />
            نمایش مرکز تهران
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-medium mb-3">موقعیت انتخابی</h3>
            <div className="flex items-center gap-2 w-full flex-1">
              <div className={'flex-1'}>
                <p className="text-xs text-muted-foreground mb-1">عرض جغرافیایی</p>
                <div className="font-mono text-sm bg-background p-2 rounded border text-center">{selectedLocation.lat.toFixed(6)}</div>
              </div>
              <div className={'flex-1'}>
                <p className="text-xs text-muted-foreground mb-1">طول جغرافیایی</p>
                <div className="font-mono text-sm bg-background p-2 rounded border text-center">{selectedLocation.lng.toFixed(6)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">راهنمای استفاده:</p>
              <ul className="text-blue-600 dark:text-blue-400 space-y-1">
                <li>• روی نقشه کلیک کنید تا موقعیت را انتخاب کنید</li>
                <li>• از دکمه &#34;موقعیت فعلی من&#34; برای استفاده از موقعیت کنونی استفاده کنید</li>
                <li>• می‌توانید نقشه را با ماوس جابجا کنید یا از دکمه‌های زوم استفاده کنید</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
