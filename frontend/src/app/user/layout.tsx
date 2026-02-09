// app/(site)/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, LayoutDashboard, LogOut, Menu, Settings, ShoppingBag, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '../../hooks/useUser'
import { useConfirm } from '../../hooks/useConfirm'
import { getFullName, getImageUrl } from '../../lib/utils'

const menuItems = [
  {
    title: 'داشبورد',
    href: '/user',
    icon: LayoutDashboard,
  },
  {
    title: 'سفارشات من',
    href: '/user/orders',
    icon: ShoppingBag,
  },
  {
    title: 'پروفایل',
    href: '/user/profile',
    icon: User,
  },
  {
    title: 'تنظیمات',
    href: '/user/settings',
    icon: Settings,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useUser()
  const { confirm } = useConfirm()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-200 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-auto lg:w-64
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={getImageUrl(user?.profile?.avatar?.url)} />
                <AvatarFallback>{user?.profile?.firstName}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{getFullName(user?.profile ?? null)}</h3>
                <p className="text-sm text-muted-foreground">{user?.mobile}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-colors hover:bg-gray-100
                        ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'}
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {isActive && <ChevronRight className="h-4 w-4 mr-auto" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() =>
                confirm({
                  title: 'خروج',
                  description: 'برای خروج مطمعن هستید؟',
                  confirmText: 'خروج',
                  cancelText: 'خیر',
                  onConfirm: logout,
                })
              }
            >
              <LogOut className="h-5 w-5" />
              خروج از حساب
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="p-4 lg:p-6 flex-1">{children}</main>
    </div>
  )
}
