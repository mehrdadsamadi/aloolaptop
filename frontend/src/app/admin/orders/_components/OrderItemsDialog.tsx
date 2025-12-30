// app/admin/orders/_components/OrderItemsDialog.tsx
'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, Hash, Image as ImageIcon, Package } from 'lucide-react'
import { formatPersianDate, getImageUrl } from '@/lib/utils'
import Image from 'next/image'
import { Item } from '@/types/admin/order.type'

interface OrderItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: Item[]
  title?: string
  description?: string
}

export default function OrderItemsDialog({
  open,
  onOpenChange,
  items,
  title = 'محصولات سفارش',
  description = 'جزئیات محصولات این سفارش',
}: OrderItemsDialogProps) {
  // محاسبه جمع کل
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)

  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' تومان'
  }

  return (
    <Dialog
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      showCloseButton={true}
      actions={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span>تعداد کل: </span>
              <Badge variant="outline">{totalQuantity}</Badge>
            </div>
            <Separator
              orientation="vertical"
              className="h-4"
            />
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>مبلغ کل: </span>
              <Badge
                variant="outline"
                className="font-bold"
              >
                {formatPrice(totalAmount)}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            بستن
          </Button>
        </div>
      }
    >
      <ScrollArea className="h-[400px]">
        <div
          className="space-y-6"
          dir={'rtl'}
        >
          {items.map((item, index) => (
            <div
              key={item._id}
              className="space-y-4"
            >
              {/* شماره محصول */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  ID: {item.productId}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* تصویر محصول */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>تصویر محصول</span>
                  </div>
                  <div className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                    {item.image ? (
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 200px)"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                {/* اطلاعات قیمت */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>قیمت واحد</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">قیمت پایه:</span>
                            <span className="font-mono text-xs text-left text-nowrap">{formatPrice(item.unitPrice)}</span>
                          </div>
                          {item.discountPercent > 0 && (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm">تخفیف:</span>
                              <Badge variant="destructive">{item.discountPercent}%</Badge>
                            </div>
                          )}
                          <Separator />
                          <div className="flex flex-col gap-1 font-bold">
                            <span className={'text-sm'}>قیمت نهایی:</span>
                            <span className="font-mono text-green-600 text-xs text-left text-nowrap">
                              {formatPrice(item.finalUnitPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>تعداد و قیمت کل</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">تعداد:</span>
                            <Badge
                              variant="outline"
                              className="font-mono"
                            >
                              {item.quantity} عدد
                            </Badge>
                          </div>
                          <Separator />
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">قیمت کل:</span>
                            <span className="font-mono font-bold text-left text-sm text-nowrap">{formatPrice(item.totalPrice)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 text-nowrap">
                            {item.quantity} × {formatPrice(item.finalUnitPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* اطلاعات زمانی */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>تاریخ ایجاد</span>
                      </div>
                      <div className="p-2 bg-muted/50 rounded text-sm">{formatPersianDate(item.createdAt)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>آخرین به‌روزرسانی</span>
                      </div>
                      <div className="p-2 bg-muted/50 rounded text-sm">{formatPersianDate(item.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* جداکننده بین محصولات */}
              {index < items.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Dialog>
  )
}
