// components/map/location-picker-map-content.tsx
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// رفع مشکل آیکون marker در Leaflet
// این باید فقط در سمت کلاینت اجرا شود
if (typeof window !== 'undefined') {
  // رفع مشکل آیکون‌ها فقط در کلاینت
  import('leaflet').then((L) => {
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
      iconUrl: '/leaflet/images/marker-icon.png',
      shadowUrl: '/leaflet/images/marker-shadow.png',
    })
  })
}

interface LocationPickerMapContentProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
  zoom?: number
}

// کامپوننت برای کنترل مرکز نقشه از بیرون
function MapController({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap()

  useEffect(() => {
    if (lat && lng && map) {
      map.flyTo([lat, lng], zoom || map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.25,
      })
    }
  }, [lat, lng, zoom, map])

  return null
}

// کامپوننت داخلی برای مدیریت کلیک‌ها
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onLocationChange(lat, lng)
    },
  })
  return null
}

export default function LocationPickerMapContent({ latitude, longitude, onLocationChange, zoom = 13 }: LocationPickerMapContentProps) {
  const [center, setCenter] = useState<[number, number]>([35.6892, 51.389]) // تهران به عنوان پیش‌فرض
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // صبر کن تا مطمئن شویم window وجود دارد
    if (typeof window !== 'undefined') {
      setIsReady(true)

      // اگر مختصات معتبر داده شده، از آنها استفاده کن
      if (latitude && longitude) {
        setCenter([latitude, longitude])
      }
    }
  }, [latitude, longitude])

  if (!isReady) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    )
  }

  // ایجاد آیکون‌ها فقط در سمت کلاینت
  const customIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="32px" height="32px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          lat={latitude}
          lng={longitude}
          zoom={16}
        />

        {latitude && longitude && (
          <Marker
            position={[latitude, longitude]}
            icon={customIcon}
          />
        )}

        <MapClickHandler onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  )
}
