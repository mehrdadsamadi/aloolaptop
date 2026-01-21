'use client'

import * as React from 'react'
import { useMemo } from 'react'

import { Sidebar as ShadSidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavUser } from '@/components/admin/sidebar/nav-user'
import FavoriteSwitcher from '@/components/admin/sidebar/favorite-switcher'
import NavMain from '@/components/admin/sidebar/nav-main'
import { useSidebarLinks } from '@/hooks/useSidebarLinks'

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadSidebar>) {
  const { links: sidebarLinks, isLoading, updateFavorite, updateAllLinks } = useSidebarLinks()

  const favoriteLinks = useMemo(() => {
    return sidebarLinks.filter((item) => item.isFavorite)
  }, [sidebarLinks])

  // اگر در حال بارگذاری هستیم، نمایش spinner یا جایگزین
  if (isLoading) {
    return (
      <ShadSidebar
        collapsible="icon"
        {...props}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </ShadSidebar>
    )
  }

  return (
    <ShadSidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <FavoriteSwitcher
          favorites={favoriteLinks}
          allLinks={sidebarLinks}
          onUpdateFavorite={updateFavorite}
          onUpdateAllLinks={updateAllLinks}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </ShadSidebar>
  )
}
