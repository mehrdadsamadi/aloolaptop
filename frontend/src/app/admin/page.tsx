'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, DollarSign, Package, ShoppingCart, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// کامپوننت‌های فرضی - باید جداگانه بسازید یا از shadcn نصب کنید
import { SalesChart } from '@/components/admin/dashboard/salesChart'
import { GrowthChart } from '@/components/admin/dashboard/growthChart'
import { useEffect, useState } from 'react'
import { getProductStats, getUserStats } from '@/actions/statistic.action'
import { IChartStats, IStats } from '@/types/admin/statistic.type'

export default function AdminPage() {
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
      key: 'sales',
      title: 'فروش امروز',
      value: '۱۲,۴۵۰,۰۰۰ تومان',
      change: '+8.2%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      key: 'orders',
      title: 'سفارشات جدید',
      value: '۴۵۶',
      change: '+5.3%',
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
    {
      key: 'carts',
      title: 'میانگین سبد خرید',
      value: '۲۷۵,۰۰۰ تومان',
      change: '+4.7%',
      icon: CreditCard,
      trend: 'up',
    },
  ])
  const [userStats, setUserStats] = useState<IChartStats | null>(null)
  const [productStats, setProductStats] = useState<IChartStats | null>(null)

  const getUserStatistics = async () => {
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
  }

  const getProductStatistics = async () => {
    const res = await getProductStats()

    console.log('product', res)
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
  }

  useEffect(() => {
    getUserStatistics()
    getProductStatistics()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">داشبورد مدیریت</h1>
          <p className="text-muted-foreground text-sm">خوش آمدید! اینجا می‌توانید عملکرد کلی سیستم را مشاهده کنید.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled
          >
            <UserPlus className="ml-2 h-4 w-4" />
            خروجی گزارش
          </Button>
          <Button>بروزرسانی داده‌ها</Button>
        </div>
      </div>

      {/* آمار اصلی */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
            <SalesChart />
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
            <CardTitle>آخرین سفارشات</CardTitle>
            <CardDescription>۱۰ سفارش اخیر</CardDescription>
          </CardHeader>
          <CardContent>{/*<RecentOrders />*/}</CardContent>
        </Card>
      </div>

      {/* محصولات پرطرفدار */}
      <Card>
        <CardHeader>
          <CardTitle>محصولات پرفروش</CardTitle>
          <CardDescription>۱۰ محصول برتر این ماه</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'گوشی موبایل X10', sales: 245, revenue: '۱۲۵۰ میلیون' },
              { name: 'لپ‌تاپ پرو مکس', sales: 189, revenue: '۹۸۰ میلیون' },
              { name: 'هدفون بی‌سیم', sales: 156, revenue: '۳۲۰ میلیون' },
              { name: 'ماوس گیمینگ', sales: 142, revenue: '۱۸۰ میلیون' },
              { name: 'کیبورد مکانیکی', sales: 128, revenue: '۲۱۰ میلیون' },
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">{index + 1}</div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} فروش</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{product.revenue}</p>
                  <p className="text-sm text-muted-foreground">درآمد</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
