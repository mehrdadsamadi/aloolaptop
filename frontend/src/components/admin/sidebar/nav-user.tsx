'use client'

import { Bell, ChevronsUpDown, LogOut, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useUser } from '@/hooks/useUser'
import { getFullName, getImageUrl } from '@/lib/utils'
import { useConfirm } from '@/hooks/useConfirm'
import { useState } from 'react'
import ChangeProfileDialog from '@/components/admin/dialogs/changeProfile'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { confirm } = useConfirm()
  const { logout } = useUser()
  const { user } = useUser()

  const [changeProfileDialog, setChangeProfileDialog] = useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={getImageUrl(user?.profile?.avatar?.url)}
                  alt={getFullName(user?.profile ?? null)}
                />
                <AvatarFallback className="rounded-lg">اد</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">{getFullName(user?.profile ?? null)}</span>
                <span className="truncate text-xs">{user?.mobile}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align={'start'}
            sideOffset={4}
          >
            <DropdownMenuLabel
              dir={'rtl'}
              className="p-0 font-normal"
            >
              <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={getImageUrl(user?.profile?.avatar?.url)}
                    alt={getFullName(user?.profile ?? null)}
                  />
                  <AvatarFallback className="rounded-lg">اد</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">{getFullName(user?.profile ?? null)}</span>
                  <span className="truncate text-xs">{user?.mobile}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup dir={'rtl'}>
              <DropdownMenuItem
                className={'cursor-pointer'}
                onClick={() => setChangeProfileDialog(true)}
              >
                <UserIcon />
                حساب کاربری
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={true}
                className={'cursor-pointer'}
              >
                <Bell />
                نوتیفیکیشن ها
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                confirm({
                  title: 'خروج',
                  description: `آیا برای خروج مطمئن هستید؟`,
                  confirmText: 'بله',
                  cancelText: 'خیر',
                  onConfirm: logout,
                })
              }}
              dir={'rtl'}
              className={'cursor-pointer'}
              variant={'destructive'}
            >
              <LogOut />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <ChangeProfileDialog
        open={changeProfileDialog}
        onOpenChange={setChangeProfileDialog}
      />
    </SidebarMenu>
  )
}
