'use client'

import * as React from 'react'
import { BoxesIcon, LaptopMinimalIcon, LayoutDashboardIcon, ListIcon, TicketPercentIcon, UsersIcon } from 'lucide-react'

import { Sidebar as ShadSidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { FavoriteSwitcher } from '@/components/admin/sidebar/favorite-switcher'
import { NavMain } from '@/components/admin/sidebar/nav-main'
import { NavUser } from '@/components/admin/sidebar/nav-user'

// This is sample data.
const data = {
  favorites: [
    {
      name: 'کاربران',
      icon: UsersIcon,
      url: '/admin/users',
    },
    {
      name: 'دسته بندی ها',
      icon: ListIcon,
      url: '/admin/categories',
    },
    {
      name: 'محصولات',
      icon: BoxesIcon,
      url: '/admin/products',
    },
  ],
  navMain: [
    {
      title: 'داشبورد',
      url: '/admin',
      icon: LayoutDashboardIcon,
      isActive: true,
    },
    {
      title: 'دسته بندی ها',
      url: '/admin/categories',
      icon: ListIcon,
      isActive: false,
    },
    {
      title: 'محصولات',
      url: '/admin/products',
      icon: BoxesIcon,
      isActive: false,
    },
    {
      title: 'کوپن تخفیف',
      url: '/admin/coupons',
      icon: TicketPercentIcon,
      isActive: false,
    },
    {
      title: 'کاربران',
      url: '/admin/users',
      icon: UsersIcon,
      items: [
        {
          title: 'لیست کاربران',
          url: '/admin/users',
        },
        {
          title: 'دیدگاه ها و امتیاز ها',
          url: '/admin/reviews',
        },
      ],
    },
    {
      title: 'سفارشات',
      url: '/admin/orders',
      icon: LaptopMinimalIcon,
      items: [
        {
          title: 'منتظر پرداخت',
          url: '/admin/orders?status=awaiting_payment',
        },
        {
          title: 'پرداخت شده',
          url: '/admin/orders?status=paid',
        },
        {
          title: 'درحال پردازش',
          url: '/admin/orders?status=processing',
        },
        {
          title: 'ارسال شده',
          url: '/admin/orders?status=shipped',
        },
        {
          title: 'تحویل داده شده',
          url: '/admin/orders?status=delivered',
        },
        {
          title: 'لغو شده',
          url: '/admin/orders?status=canceled',
        },
        {
          title: 'برگشت خورده',
          url: '/admin/orders?status=refunded',
        },
      ],
    },
  ],
}

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadSidebar>) {
  return (
    <ShadSidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <FavoriteSwitcher favorites={data.favorites} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </ShadSidebar>
  )
}
