'use client'
import { IOrder, OrderStatus } from '@/types/admin/order.type'
import { useEffect, useState } from 'react'
import { getUserOrdersList } from '@/actions/order.action'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Filter, Package, RefreshCw, Search, Truck, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface UserOrdersProps {
  status: OrderStatus | 'all'
}

export default function UserOrders({ status }: UserOrdersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>(status)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [pagesCount, setPagesCount] = useState(1)

  useEffect(() => {
    ordersList()
  }, [page, limit])

  const ordersList = async () => {
    try {
      setLoading(true)

      clearUrl()

      const res = await getUserOrdersList({
        pagination: {
          page,
          limit,
        },
        ...(statusFilter !== 'all' && { status: statusFilter }),
        trackingCode: search,
      })

      setOrders(res?.orders)
      setPagesCount(res?.pagination?.pagesCount)
    } catch (e) {
      console.log('error', e)
    } finally {
      setLoading(false)
    }
  }

  const clearUrl = () => {
    router.replace(pathname, { scroll: false })
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
    > = {
      awaiting_payment: {
        label: 'در انتظار پرداخت',
        variant: 'secondary',
        icon: <Clock className="h-3 w-3 ml-1" />,
      },
      paid: {
        label: 'پرداخت شده',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3 ml-1" />,
      },
      processing: {
        label: 'در حال پردازش',
        variant: 'default',
        icon: <RefreshCw className="h-3 w-3 ml-1" />,
      },
      shipped: {
        label: 'در حال ارسال',
        variant: 'default',
        icon: <Truck className="h-3 w-3 ml-1" />,
      },
      delivered: {
        label: 'تحویل شده',
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3 ml-1" />,
      },
      canceled: {
        label: 'لغو شده',
        variant: 'destructive',
        icon: <XCircle className="h-3 w-3 ml-1" />,
      },
      refunded: {
        label: 'عودت داده شده',
        variant: 'destructive',
        icon: <XCircle className="h-3 w-3 ml-1" />,
      },
    }

    const config = statusConfig[status] || {
      label: status,
      variant: 'outline' as const,
      icon: <Package className="h-3 w-3 ml-1" />,
    }

    return (
      <Badge
        variant={config.variant}
        className="gap-1"
      >
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }

  if (loading) {
    return <OrdersLoading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">سفارشات من</h1>
        <p className="text-muted-foreground">تمام سفارش‌های شما در یک نگاه</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              <div className="relative w-sm">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="جستجوی سفارش با کد رهگیری..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>

              <div className={'w-px h-7 bg-muted'} />

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select
                  value={statusFilter}
                  onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="فیلتر بر اساس وضعیت" />
                  </SelectTrigger>
                  <SelectContent position={'popper'}>
                    <SelectItem value="all">همه سفارشات</SelectItem>
                    <SelectItem value="awaiting_payment">در انتظار پرداخت</SelectItem>
                    <SelectItem value="paid">پرداخت شده</SelectItem>
                    <SelectItem value="processing">در حال پردازش</SelectItem>
                    <SelectItem value="shipped">در حال ارسال</SelectItem>
                    <SelectItem value="delivered">تحویل شده</SelectItem>
                    <SelectItem value="canceled">لغو شده</SelectItem>
                    <SelectItem value="refunded">عودت داده شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={ordersList}>
                <RefreshCw className="h-4 w-4 ml-2" />
                بروزرسانی
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>لیست سفارشات</CardTitle>
        </CardHeader>
        <CardContent>
          {orders?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">سفارشی یافت نشد</h3>
              <p className="text-muted-foreground mb-6">
                {statusFilter !== 'all' ? `سفارشی با این وضعیت پیدا نشد.` : 'شما هنوز سفارشی ثبت نکرده‌اید.'}
              </p>
              <Link href="/products">
                <Button>شروع خرید</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders?.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{order.trackingCode}</h4>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)} • {order.totalItems} قلم کالا
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold">{formatPrice(order.totalPrice)}</p>
                      <p className="text-sm text-muted-foreground">مبلغ کل</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/orders/${order._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          جزئیات
                        </Button>
                      </Link>
                      {order.status === 'awaiting_payment' && <Button size="sm">پرداخت</Button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {orders?.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                نمایش {orders.length} سفارش از {orders.length} سفارش
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                  قبلی
                </Button>
                <span className="px-3 py-1 text-sm">
                  صفحه {page} از {pagesCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagesCount, p + 1))}
                  disabled={page === pagesCount}
                >
                  بعدی
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// کامپوننت Loading
function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border gap-4"
            >
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
