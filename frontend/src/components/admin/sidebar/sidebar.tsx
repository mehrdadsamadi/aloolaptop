'use client'

import * as React from 'react'
import { BoxesIcon, LayoutDashboardIcon, ListIcon, Settings2, UsersIcon } from 'lucide-react'

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
      title: 'کاربران',
      url: '/admin/users',
      icon: UsersIcon,
      isActive: false,
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
      title: 'تنظیمات',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'تست',
          url: '#',
        },
        {
          title: 'تست',
          url: '#',
        },
        {
          title: 'تست',
          url: '#',
        },
        {
          title: 'تست',
          url: '#',
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
