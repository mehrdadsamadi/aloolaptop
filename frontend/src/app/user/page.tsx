'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CheckCircle, Package, Settings, ShoppingBag, TrendingUp, Truck } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'

// این داده‌ها از API گرفته می‌شوند
const stats = [
  {
    title: 'کل سفارشات',
    value: '۱۲',
    icon: ShoppingBag,
    color: 'bg-blue-500',
    change: '+۲.۵%',
    href: '/user/orders',
  },
  {
    title: 'در حال پردازش',
    value: '۳',
    icon: Package,
    color: 'bg-amber-500',
    change: '+۱',
    href: '/user/orders?status=processing',
  },
  {
    title: 'در حال ارسال',
    value: '۲',
    icon: Truck,
    color: 'bg-purple-500',
    change: '۰',
    href: '/user/orders?status=shipped',
  },
  {
    title: 'تحویل شده',
    value: '۷',
    icon: CheckCircle,
    color: 'bg-green-500',
    change: '+۳',
    href: '/user/orders?status=delivered',
  },
]

const recentOrders = [
  {
    id: 'ORD-123456',
    date: '۱۴۰۲/۱۱/۲۰',
    total: '۲,۵۰۰,۰۰۰ تومان',
    status: 'تحویل شده',
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    id: 'ORD-123457',
    date: '۱۴۰۲/۱۱/۱۸',
    total: '۱,۸۰۰,۰۰۰ تومان',
    status: 'در حال ارسال',
    statusColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'ORD-123458',
    date: '۱۴۰۲/۱۱/۱۵',
    total: '۳,۲۰۰,۰۰۰ تومان',
    status: 'در حال پردازش',
    statusColor: 'bg-amber-100 text-amber-800',
  },
]

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">سلام، {user?.profile?.firstName} 👋</h1>
        <p className="text-muted-foreground">به پنل کاربری خود خوش آمدید. اینجا می‌توانید سفارشات خود را مدیریت کنید.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 ml-1" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent UserOrders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>آخرین سفارشات</CardTitle>
            <Link href="/dashboard/orders">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
              >
                مشاهده همه
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{order.id}</h4>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-medium">{order.total}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>{order.status}</span>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        جزئیات
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 ">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                ادامه خرید
              </Button>
            </Link>
            <Link href="/user/orders">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Package className="h-4 w-4" />
                پیگیری سفارش
              </Button>
            </Link>
            <Link href="/support">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                پشتیبانی
              </Button>
            </Link>
            <Link href="/user/settings">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                تنظیمات حساب
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
