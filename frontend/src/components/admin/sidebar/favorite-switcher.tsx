'use client'

import * as React from 'react'
import { useState } from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'
import AddToFavoriteDialog from '@/components/admin/dialogs/addToFavoriteDialog'
import { ISidebarLink } from '@/types/admin/sidebar'

interface FavoriteSwitcherProps {
  favorites: ISidebarLink[]
  allLinks: ISidebarLink[]
  onUpdateFavorite: (title: string, isFavorite: boolean) => void
  onUpdateAllLinks: (links: ISidebarLink[]) => void
}

export default function FavoriteSwitcher({ favorites, allLinks, onUpdateFavorite, onUpdateAllLinks }: FavoriteSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(favorites?.[0])
  const [addToFavoriteDialogState, setAddToFavoriteDialogState] = useState(false)

  if (!activeTeam && favorites.length > 0) {
    setActiveTeam(favorites[0])
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {activeTeam && <activeTeam.icon className="size-4" />}
                </div>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">{activeTeam?.title || 'علاقه‌مندی‌ها'}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs text-right">علاقه مندی ها</DropdownMenuLabel>
              {favorites.map((fav, index) => (
                <DropdownMenuItem
                  key={fav.title}
                  onClick={() => setActiveTeam(fav)}
                  className="gap-2 p-2 cursor-pointer"
                  dir={'rtl'}
                  asChild
                >
                  <Link href={fav.url}>
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <fav.icon className="size-3.5 shrink-0" />
                    </div>
                    {fav.title}
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2 p-2 cursor-pointer"
                dir={'rtl'}
                onClick={() => setAddToFavoriteDialogState(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <p className="text-muted-foreground font-medium">مدیریت علاقه مندی ها</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AddToFavoriteDialog
        open={addToFavoriteDialogState}
        onOpenChange={setAddToFavoriteDialogState}
        allLinks={allLinks}
        onUpdateFavorite={onUpdateFavorite}
        onUpdateAllLinks={onUpdateAllLinks}
      />
    </>
  )
}
