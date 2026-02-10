// app/(site)/user/orders/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BadgeAlert,
  Calendar,
  ChevronRight,
  CreditCard,
  Home,
  MapPin,
  Package,
  Phone,
  Printer,
  Share2,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { toast } from 'sonner'
import { IOrder, OrderStatus } from '@/types/admin/order.type'
import { getOrderById } from '@/actions/order.action'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatPrice, getFullName } from '@/lib/utils'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { ORDER_STATUS_CONSTANTS } from '@/lib/constants/order.constant'

interface OrderDetailProps {
  id: string
}

export default function OrderDetail({ id }: OrderDetailProps) {
  const router = useRouter()

  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)

      const res = await getOrderById(id)

      setOrder(res)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('خطا در دریافت اطلاعات سفارش')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      {
        label: string
        color: string
        icon: React.ReactNode
        description: string
      }
    > = {
      awaiting_payment: {
        label: 'در انتظار پرداخت',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <CreditCard className="h-4 w-4" />,
        description: 'لطفا برای تکمیل سفارش پرداخت را انجام دهید.',
      },
      paid: {
        label: 'پرداخت شده',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CreditCard className="h-4 w-4" />,
        description: 'پرداخت شما با موفقیت انجام شد.',
      },
      processing: {
        label: 'در حال پردازش',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <Package className="h-4 w-4" />,
        description: 'سفارش شما در حال آماده‌سازی است.',
      },
      shipped: {
        label: 'در حال ارسال',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <Truck className="h-4 w-4" />,
        description: 'سفارش شما ارسال شده است.',
      },
      delivered: {
        label: 'تحویل شده',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <Package className="h-4 w-4" />,
        description: 'سفارش شما با موفقیت تحویل داده شد.',
      },
      canceled: {
        label: 'لغو شده',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <Package className="h-4 w-4" />,
        description: 'سفارش شما لغو شده است.',
      },
      refunded: {
        label: 'عودت داده شده',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <CreditCard className="h-4 w-4" />,
        description: 'مبلغ سفارش به حساب شما بازگردانده شد.',
      },
    }

    return (
      statusConfig[status] || {
        label: status,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Package className="h-4 w-4" />,
        description: '',
      }
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('لینک سفارش کپی شد')
  }

  if (loading) {
    return <OrderDetailLoading />
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">سفارش یافت نشد</h3>
        <p className="text-muted-foreground mb-6">سفارش مورد نظر وجود ندارد یا حذف شده است.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push('/user/orders')}>مشاهده سفارشات</Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            صفحه اصلی
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/user/orders')}
              className="gap-1"
            >
              <ChevronRight className="h-4 w-4" />
              بازگشت
            </Button>
            <h1 className="text-2xl lg:text-3xl font-bold">سفارش {order.trackingCode}</h1>
          </div>
          <p className="text-muted-foreground">جزئیات کامل سفارش شما</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 ml-2" />
            اشتراک‌گذاری
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 ml-2" />
            چاپ
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className={`border-l-4 ${statusInfo.color.split(' ')[0].replace('bg-', 'border-')}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${statusInfo.color.split(' ')[0]}`}>{statusInfo.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">وضعیت سفارش</h3>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>تاریخ ثبت سفارش:</span>
                <span className="font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>آخرین بروزرسانی:</span>
                <span className="font-medium">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            className={'cursor-pointer'}
            value="details"
          >
            جزئیات سفارش
          </TabsTrigger>
          <TabsTrigger
            className={'cursor-pointer'}
            value="timeline"
          >
            روند سفارش
          </TabsTrigger>
          <TabsTrigger
            className={'cursor-pointer'}
            value="invoice"
          >
            صورتحساب
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="details"
          className="space-y-6"
        >
          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>کالاهای سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const hasDiscount =
                    item?.discountPercent > 0 && (!item?.discountExpiresAt || new Date(item?.discountExpiresAt) > new Date())

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{item.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>تعداد: {item.quantity}</span>
                          <span>•</span>
                          <span>قیمت واحد: {formatPrice(item.unitPrice)}</span>
                          {hasDiscount && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">تخفیف: {formatPrice(item.unitPrice - item.finalUnitPrice)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{formatPrice(item.totalPrice)}</p>
                        <p className="text-sm text-muted-foreground">قیمت کل</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary & Address */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">قیمت کالاها:</span>
                  <span>{formatPrice(order.finalItemsPrice)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف:</span>
                    <span>- {formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                {order.couponId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">کد تخفیف:</span>
                    <Badge variant="outline">{order.couponId.code}</Badge>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">مبلغ قابل پرداخت:</span>
                  <span className="font-bold text-lg">{formatPrice(order.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تعداد کالا:</span>
                  <span>{order.totalItems} قلم</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تعداد کل:</span>
                  <span>{order.totalQuantity} عدد</span>
                </div>
              </CardContent>
            </Card>

            {/* Address & Customer */}
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات ارسال و دریافت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <h4 className="font-medium">مشخصات گیرنده</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{getFullName(order.userId.profile)}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      {order.userId.mobile}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <h4 className="font-medium">آدرس ارسال</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>
                      {order.addressId.state}، {order.addressId.city}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{order.addressId.address}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span>کد پستی: {order.addressId.postalCode}</span>
                      <span>•</span>
                      <span>تلفن: {order.userId.mobile}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>روند سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute right-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                {order.meta?.history ? (
                  order.meta?.history?.map((event, index) => (
                    <div
                      key={index}
                      className="relative flex items-start gap-4 mb-8 last:mb-0"
                    >
                      <div className="relative z-10">
                        <div
                          className={`h-10 w-10 pt-1 rounded-full flex items-center justify-center ${
                            index === order.meta!.history!.length - 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{ORDER_STATUS_CONSTANTS[event.to]}</h4>
                          <time className="text-sm text-muted-foreground">{formatDate(event.at)}</time>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          تغییر وضعیت از {ORDER_STATUS_CONSTANTS[event.from]} به {ORDER_STATUS_CONSTANTS[event.to]}
                        </p>
                        {event.meta?.trackingCode && (
                          <div className="mt-2">
                            <Badge
                              className={'py-1.5 px-3'}
                              variant="outline"
                            >
                              کد پیگیری پستی: {event.meta.trackingCode}
                            </Badge>
                          </div>
                        )}
                        {event.meta?.reason && (
                          <div className="bg-gray-50 p-2 rounded-lg mt-2">
                            <p className="text-sm text-muted-foreground">پیام پشتیبانی: {event.meta.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <Alert>
                    <BadgeAlert />
                    <AlertTitle>در انتظار تایید سفارش</AlertTitle>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>صورتحساب سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                  <div>
                    <h3 className="text-xl font-bold">فاکتور فروش {order.trackingCode}</h3>
                    <p className="text-muted-foreground">تاریخ: {formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">فروشنده</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">فروشگاه اینترنتی الو لپتاپ</p>
                      <p className="text-sm text-muted-foreground mt-1">مشهد، خیابان ابن سینا</p>
                      <p className="text-sm text-muted-foreground">تلفن: 09039098494</p>
                      {/*<p className="text-sm text-muted-foreground">ایمیل: info@shop.com</p>*/}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">خریدار</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {order.userId.profile.firstName} {order.userId.profile.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">تلفن: {order.userId.mobile}</p>
                      <p className="text-sm text-muted-foreground">{order.addressId.address}</p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4">ردیف</th>
                        <th className="text-right py-3 px-4">کالا</th>
                        <th className="text-right py-3 px-4">تعداد</th>
                        <th className="text-right py-3 px-4">قیمت واحد</th>
                        <th className="text-right py-3 px-4">مبلغ کل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">{formatPrice(item.finalUnitPrice)}</td>
                          <td className="py-3 px-4 font-medium">{formatPrice(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Invoice Summary */}
                <div className="border-t pt-6">
                  <div className="max-w-md ml-auto space-y-2">
                    <div className="flex justify-between">
                      <span>جمع کل:</span>
                      <span>{formatPrice(order.finalItemsPrice)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>تخفیف:</span>
                        <span>- {formatPrice(order.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                      <span>مبلغ قابل پرداخت:</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {order.meta?.payment?.refId && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">اطلاعات پرداخت</h4>
                    <div className="flex items-center gap-4">
                      <span>شماره پیگیری پرداخت:</span>
                      <Badge>{order.meta.payment.refId}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/user/orders"
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full"
          >
            <ShoppingBag className="h-4 w-4 ml-2" />
            همه سفارشات
          </Button>
        </Link>
        <Link
          href="/"
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full"
          >
            <Home className="h-4 w-4 ml-2" />
            صفحه اصلی
          </Button>
        </Link>
        {order.status === 'awaiting_payment' && <Button className="flex-1">پرداخت سفارش</Button>}
      </div>
    </div>
  )
}

// کامپوننت Loading برای جزئیات سفارش
function OrderDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex justify-between"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
