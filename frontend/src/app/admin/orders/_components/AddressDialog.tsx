// app/admin/orders/_components/AddressDialog.tsx
'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, CheckCircle, Home, Mail, MapIcon, MapPin, Navigation } from 'lucide-react'
import { formatPersianDate } from '@/lib/utils'
import { AddressId } from '@/types/admin/order.type'

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: AddressId | null
  title?: string
}

export default function AddressDialog({ open, onOpenChange, address, title = 'اطلاعات آدرس' }: AddressDialogProps) {
  if (!address) return null

  // فرمت مختصات برای نمایش
  const formatCoordinates = () => {
    if (!address.location?.coordinates) return 'ثبت نشده'
    const [lng, lat] = address.location.coordinates
    return `عرض: ${lat.toFixed(4)}° ، طول: ${lng.toFixed(4)}°`
  }

  // لینک گوگل مپ
  const getGoogleMapsLink = () => {
    if (!address.location?.coordinates) return null
    const [lng, lat] = address.location.coordinates
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  return (
    <Dialog
      title={title}
      description={`آدرس ${address.title}`}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      actions={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>ایجاد: {formatPersianDate(address.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            {getGoogleMapsLink() && (
              <a
                href={getGoogleMapsLink()!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border px-2 py-1.5 hover:bg-muted rounded-lg"
              >
                <MapIcon className="h-4 w-4" />
                مشاهده در نقشه
              </a>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              بستن
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* عنوان و وضعیت */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">{address.title}</h3>
            </div>
            {address.isDefault && (
              <Badge className="flex items-center gap-1 w-fit">
                <CheckCircle className="h-3 w-3" />
                آدرس پیش‌فرض
              </Badge>
            )}
          </div>
          <Badge
            variant="outline"
            className="text-xs"
          >
            ID: {address._id}
          </Badge>
        </div>

        <Separator />

        {/* اطلاعات آدرس */}
        <div className="space-y-4">
          {/* آدرس کامل */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>آدرس کامل</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-justify leading-relaxed">{address.address}</p>
            </div>
          </div>

          {/* اطلاعات منطقه */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-sm">استان</span>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-medium">{address.state}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-sm">شهر</span>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-medium">{address.city}</p>
              </div>
            </div>
          </div>

          {/* کد پستی و مختصات */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>کد پستی</span>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-mono font-medium">{address.postalCode}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>مختصات جغرافیایی</span>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="text-sm">{formatCoordinates()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
