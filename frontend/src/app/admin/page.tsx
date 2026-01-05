'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// کامپوننت‌های فرضی - باید جداگانه بسازید یا از shadcn نصب کنید
import { GrowthChart } from '@/components/admin/dashboard/growthChart'
import { useEffect, useState } from 'react'
import { getOrderStats, getPaymentStats, getProductStats, getTopSellingProducts, getUserStats } from '@/actions/statistic.action'
import { IChartStats, IStats, TopSellingProduct } from '@/types/admin/statistic.type'
import { useLoading } from '@/hooks/useLoading'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { TopSellingProductsSortBy } from '@/lib/enums/topSellingProductsSortBy.enum'

export default function AdminPage() {
  const { showLoading, hideLoading } = useLoading()

  const [stats, setStats] = useState<IStats[]>([
    {
      key: 'users',
      title: 'کل کاربران',
      value: '0',
      change: '0',
      icon: Users,
      trend: 'up',
    },
    {
      key: 'payments',
      title: 'فروش ماهانه',
      value: '0',
      change: '0',
      icon: DollarSign,
      trend: 'up',
    },
    {
      key: 'orders',
      title: 'کل سفارشات',
      value: '0',
      change: '0',
      icon: ShoppingCart,
      trend: 'up',
    },
    {
      key: 'products',
      title: 'محصولات موجود',
      value: '0',
      change: '0',
      icon: Package,
      trend: 'up',
    },
  ])
  const [userStats, setUserStats] = useState<IChartStats | null>(null)
  const [productStats, setProductStats] = useState<IChartStats | null>(null)
  const [orderStats, setOrderStats] = useState<IChartStats | null>(null)
  const [paymentStats, setPaymentStats] = useState<IChartStats | null>(null)
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[] | null>(null)
  const [topSellingSortByRevenue, setTopSellingSortByRevenue] = useState(true)

  const getUserStatistics = async () => {
    try {
      showLoading()

      const res = await getUserStats()

      setUserStats(res?.users)

      setStats((prvStats) => {
        return prvStats.map((item) =>
          item.key === 'users'
            ? {
                ...item,
                value: res?.users?.total?.toLocaleString(),
                change: `${res?.users?.growth} %`,
                trend: res?.users?.growth > 0 ? 'up' : 'down',
              }
            : item
        )
      })
    } catch (error) {
      console.log(error)
    } finally {
      hideLoading()
    }
  }

  const getProductStatistics = async () => {
    try {
      showLoading()

      const res = await getProductStats()

      setProductStats(res?.products)

      setStats((prvStats) => {
        return prvStats.map((item) =>
          item.key === 'products'
            ? {
                ...item,
                value: res?.products?.total?.toLocaleString(),
                change: `${res?.products?.growth} %`,
                trend: res?.products?.growth > 0 ? 'up' : 'down',
              }
            : item
        )
      })
    } catch (error) {
      console.log(error)
    } finally {
      hideLoading()
    }
  }

  const getOrderStatistics = async () => {
    try {
      showLoading()

      const res = await getOrderStats()

      setOrderStats(res?.orders)

      setStats((prvStats) => {
        return prvStats.map((item) =>
          item.key === 'orders'
            ? {
                ...item,
                value: res?.orders?.total?.toLocaleString(),
                change: `${res?.orders?.growth} %`,
                trend: res?.orders?.growth > 0 ? 'up' : 'down',
              }
            : item
        )
      })
    } catch (error) {
      console.log(error)
    } finally {
      hideLoading()
    }
  }

  const getPaymentStatistics = async () => {
    try {
      showLoading()

      const res = await getPaymentStats()

      setPaymentStats(res?.payments)

      setStats((prvStats) => {
        return prvStats.map((item) =>
          item.key === 'payments'
            ? {
                ...item,
                value: `${res?.payments?.total?.toLocaleString()} تومان`,
                change: `${res?.payments?.growth} %`,
                trend: res?.payments?.growth > 0 ? 'up' : 'down',
              }
            : item
        )
      })
    } catch (error) {
      console.log(error)
    } finally {
      hideLoading()
    }
  }

  const getTopSellingProductsInOrder = async () => {
    try {
      showLoading()

      const res = await getTopSellingProducts({
        sortBy: topSellingSortByRevenue ? TopSellingProductsSortBy.REVENUE : TopSellingProductsSortBy.QUANTITY,
      })

      setTopSellingProducts(res?.products)
    } catch (error) {
      console.log(error)
    } finally {
      hideLoading()
    }
  }

  const refreshStats = () => {
    getUserStatistics()
    getProductStatistics()
    getOrderStatistics()
    getPaymentStatistics()
  }

  useEffect(() => {
    refreshStats()
  }, [])

  useEffect(() => {
    getTopSellingProductsInOrder()
  }, [topSellingSortByRevenue])

  return (
    <div className="p-6 space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">داشبورد مدیریت</h1>
          <p className="text-muted-foreground text-sm">خوش آمدید! اینجا می‌توانید عملکرد کلی سیستم را مشاهده کنید.</p>
        </div>
        <Button
          onClick={() => {
            refreshStats()

            toast.success('داده ها بروزرسانی شد')
          }}
        >
          بروزرسانی داده‌ها
        </Button>
      </div>

      {/* آمار اصلی */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-1 text-xs">
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className="ml-2"
                  dir={'ltr'}
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">نسبت به ماه گذشته</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* نمودار فروش */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>گزارش فروش ماهانه</CardTitle>
            <CardDescription>عملکرد فروش در ۶ ماه گذشته</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <GrowthChart
              data={paymentStats}
              title={'فروش'}
              icon={<DollarSign className="h-5 w-5 text-blue-500" />}
              totalPostfix={'تومان'}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>رشد کاربران</CardTitle>
            <CardDescription>ثبت‌نام ماهانه کاربران جدید</CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart
              data={userStats}
              title={'کاربران'}
              icon={<Users className="h-5 w-5 text-blue-500" />}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>رشد محصولات</CardTitle>
            <CardDescription>تعداد ماهانه محصولات</CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart
              data={productStats}
              title={'محصولات'}
              icon={<Package className="h-5 w-5 text-blue-500" />}
            />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>رشد سفارشات</CardTitle>
            <CardDescription>تعداد ماهانه سفارشات</CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart
              data={orderStats}
              title={'سفارشات'}
              icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* محصولات پرطرفدار */}
      <Card className="">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">محصولات پرفروش</CardTitle>

              <div className="flex items-center gap-2">
                <CardDescription className={`mx-0 ${topSellingSortByRevenue ? 'text-foreground' : 'text-muted-foreground'}`}>
                  رتبه‌بندی بر اساس بیشترین <b>قیمت</b> فروش
                </CardDescription>
                <Switch
                  checked={topSellingSortByRevenue}
                  onCheckedChange={setTopSellingSortByRevenue}
                  dir={'ltr'}
                  id="airplane-mode"
                  className={'cursor-pointer'}
                />
                <CardDescription className={`mx-0 ${!topSellingSortByRevenue ? 'text-foreground' : 'text-muted-foreground'}`}>
                  رتبه‌بندی بر اساس بیشترین <b>تعداد</b> فروش
                </CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{topSellingProducts?.length} محصول</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topSellingProducts?.map((product, index) => (
              <div
                key={product?.productId}
                className="group flex items-center justify-between p-2 rounded-md hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold
                ${
                  index === 0
                    ? 'bg-amber-100 text-amber-800'
                    : index === 1
                      ? 'bg-gray-100 text-gray-800'
                      : index === 2
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-muted text-muted-foreground'
                }`}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{product.productName}</p>
                      <span className="font-bold text-primary text-sm">{product.totalRevenue?.toLocaleString()} تومان</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{product.totalSoldQuantity} فروش</span>
                      <span className="text-xs text-muted-foreground">
                        {((product.totalSoldQuantity * 100) / topSellingProducts.reduce((sum, p) => sum + p.totalSoldQuantity, 0)).toFixed(
                          1
                        )}
                        % از کل
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {topSellingProducts?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p>محصولی یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
