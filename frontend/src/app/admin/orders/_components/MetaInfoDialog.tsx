// app/admin/orders/_components/MetaInfoDialog.tsx
'use client'

import { Dialog } from '@/components/common/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeftIcon,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Hash,
  History,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react'
import { formatPersianDate, formatPrice } from '@/lib/utils'
import { ORDER_STATUS_CONSTANTS } from '@/lib/constants/order.constant'
import { Meta } from '@/types/admin/order.type'

interface MetaInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meta: Meta | null
  title?: string
}

// آیکون برای هر وضعیت
const getStatusIcon = (status: string) => {
  const statusIcons: Record<string, React.ReactNode> = {
    awaiting_payment: <CreditCard className="h-4 w-4" />,
    paid: <CheckCircle className="h-4 w-4 text-green-500" />,
    processing: <RefreshCw className="h-4 w-4 text-blue-500" />,
    shipped: <Truck className="h-4 w-4 text-orange-500" />,
    delivered: <Package className="h-4 w-4 text-purple-500" />,
    canceled: <XCircle className="h-4 w-4 text-red-500" />,
    refunded: <RefreshCw className="h-4 w-4 text-yellow-500" />,
  }
  return statusIcons[status] || <FileText className="h-4 w-4" />
}

// رنگ بج برای هر وضعیت
const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
    awaiting_payment: 'outline',
    paid: 'default',
    processing: 'secondary',
    shipped: 'default',
    delivered: 'default',
    canceled: 'destructive',
    refunded: 'outline',
  }
  return variants[status] || 'outline'
}

export default function MetaInfoDialog({ open, onOpenChange, meta, title = 'اطلاعات متا' }: MetaInfoDialogProps) {
  if (!meta) return null

  const hasPayment = meta.payment && Object.keys(meta.payment).length > 0
  const hasHistory = meta.history && meta.history.length > 0

  // تفسیر کد پرداخت
  const getPaymentCodeText = (code?: number) => {
    if (!code) return 'نامشخص'

    const codes: Record<number, string> = {
      100: 'پرداخت موفق',
      101: 'پرداخت قبلاً انجام شده',
      // می‌توانید کدهای دیگر را اضافه کنید
    }
    return codes[code] || `کد ${code}`
  }

  return (
    <Dialog
      title={title}
      description="اطلاعات پرداخت و تاریخچه تغییرات وضعیت"
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      actions={
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          بستن
        </Button>
      }
    >
      <ScrollArea className="h-125 pr-4">
        <div
          className="space-y-8"
          dir={'rtl'}
        >
          {/* اطلاعات پرداخت */}
          {hasPayment && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">اطلاعات پرداخت</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* شماره پیگیری */}
                {meta.payment?.refId && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      <span>شماره پیگیری</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="font-mono font-bold text-center">{meta.payment.refId}</p>
                    </div>
                  </div>
                )}

                {/* کارمزد */}
                {meta.payment?.fee !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>کارمزد درگاه</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <div className="text-center">
                        <p className="font-mono font-bold text-nowrap">{formatPrice(meta.payment.fee)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* وضعیت پرداخت */}
                {meta.payment?.code !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>وضعیت پرداخت</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <div className="text-center">
                        <p className="font-medium">{getPaymentCodeText(meta.payment.code)}</p>
                        <p className="text-xs text-muted-foreground mt-1">کد: {meta.payment.code}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* تاریخچه تغییر وضعیت‌ها */}
          {hasHistory && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">تاریخچه تغییر وضعیت‌ها</h3>
                <Badge variant="outline">{meta.history?.length} تغییر</Badge>
              </div>

              <div className="space-y-4">
                {meta.history?.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-3"
                  >
                    {/* خط زمان */}
                    <div className="flex items-start gap-4">
                      {/* دایره و خط */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        </div>
                        {index < (meta.history?.length || 0) - 1 && <div className="w-0.5 h-full bg-border flex-1 mt-2" />}
                      </div>

                      {/* محتوای تغییر */}
                      <div className="flex-1 space-y-3 pb-4 pt-1">
                        {/* وضعیت‌ها */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={'flex items-center gap-2'}>
                              {getStatusIcon(item.from)}
                              <Badge variant={getStatusBadgeVariant(item.from)}>
                                {ORDER_STATUS_CONSTANTS[item.from as keyof typeof ORDER_STATUS_CONSTANTS] || item.from}
                              </Badge>
                            </div>

                            <ArrowLeftIcon className="h-4 w-4 text-muted-foreground" />

                            <div className={'flex items-center gap-2'}>
                              {getStatusIcon(item.to)}
                              <Badge variant={getStatusBadgeVariant(item.to)}>
                                {ORDER_STATUS_CONSTANTS[item.to as keyof typeof ORDER_STATUS_CONSTANTS] || item.to}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatPersianDate(item.at)}</span>
                          </div>
                        </div>

                        {/* اطلاعات اضافی */}
                        {item.meta && (
                          <div className={'mt-6'}>
                            <div className="p-3 bg-muted/30 rounded-lg border space-y-2">
                              {/* کد رهگیری */}
                              {item.meta.trackingCode && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    <span className="text-sm">کد رهگیری پست:</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="font-mono"
                                  >
                                    {item.meta.trackingCode}
                                  </Badge>
                                </div>
                              )}

                              {/* دلیل */}
                              {item.meta.reason && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">دلیل:</span>
                                  </div>
                                  <div className="p-2 bg-background rounded text-sm">{item.meta.reason}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* اگر اطلاعاتی وجود ندارد */}
          {!hasPayment && !hasHistory && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">هیچ اطلاعات متایی ثبت نشده</h3>
              <p className="text-muted-foreground">اطلاعات پرداخت یا تاریخچه تغییر وضعیت‌ها برای این سفارش وجود ندارد.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Dialog>
  )
}
