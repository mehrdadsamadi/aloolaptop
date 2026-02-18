import * as React from 'react'

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { LayoutDashboard, Settings, ShoppingBag, User } from 'lucide-react'
import { ISidebarLink } from '@/types/admin/sidebar'
import { NavUser } from '@/components/admin/sidebar/nav-user'
import NavMain from '@/components/admin/sidebar/nav-main'

const menuItems: ISidebarLink[] = [
  {
    title: 'داشبورد',
    url: '/user',
    icon: LayoutDashboard,
    isActive: true,
    isFavorite: false,
  },
  {
    title: 'سفارشات من',
    url: '/user/orders',
    icon: ShoppingBag,
    isActive: false,
    isFavorite: false,
  },
  {
    title: 'پروفایل',
    url: '/user/profile',
    icon: User,
    isActive: false,
    isFavorite: false,
  },
  {
    title: 'تنظیمات',
    url: '/user/settings',
    icon: Settings,
    isActive: false,
    isFavorite: false,
  },
]

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>

      <hr />

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
