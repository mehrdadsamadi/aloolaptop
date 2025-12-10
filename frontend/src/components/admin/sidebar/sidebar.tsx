'use client'

import * as React from 'react'
import { AudioWaveform, ListOrderedIcon, Settings2, SquareTerminal, UsersIcon } from 'lucide-react'

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
      name: 'محصولات',
      icon: AudioWaveform,
      url: '/admin/products',
    },
    {
      name: 'سفارشات',
      icon: ListOrderedIcon,
      url: '/admin/orders',
    },
  ],
  navMain: [
    {
      title: 'کاربران',
      url: '/admin/users',
      icon: UsersIcon,
      isActive: true,
    },
    {
      title: 'محصولات',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
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
      ],
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
